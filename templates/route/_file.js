
/**
 *
 */
const sg                      = require('sgsg');
const _                       = sg._;
const serverassist            = sg.include('serverassist') || require('serverassist');
const fs                      = sg.extlibs.fsExtra;
const path                    = require('path');

const setOnn                  = sg.setOnn;
const deref                   = sg.deref;
const myColor                 = serverassist.myColor();
const myStack                 = serverassist.myStack();
const registerAsService       = serverassist.registerAsService;
const registerAsServiceApp    = serverassist.registerAsServiceApp;
const configuration           = serverassist.configuration;

const appName                 = 'foo';
const projectId               = 'sa';
const appId                   = `${projectId}_${appName}`;
const mount                   = `*/api/v1/${appName}/`;

const appRecord = {
  projectId,
  mount,
  appId,
  route               : `*/api/v:version/${appName}/`,
  isAdminApp          : false,
  useHttp             : true,
  useHttps            : true,
  requireClientCerts  : false
};


var lib = {};

lib.addRoutes = function(addRoute, onStart, db /*, addRawRoute, callback */) {
  var   args          = _.rest(arguments, 3);
  const callback      = args.pop();
  const addRawRoute   = args.shift();
  var   r;

  //-------------------------------------------------------------------------------------------------
  /**
   *  Handles xyz
   *
   *    /xyz
   *
   */
  const xyz = function(req, res, params, splats, query) {
    var   result     = {};
    const body       = serverassist.normalizeBody(req.bodyJson || {}, params || {}, query || {});

    if (!body.sessionId) {
      return serverassist._400(req, res, {ok:false}, `Must provide sessionId`);
    }

    return sg.__run2({}, callback, [function(result, next, last, abort) {

      return next();

    }], function last(err, result) {
      serverassist._200(req, res, result);
    }, function abort(err, msg) {
      if (msg)  { return sg.die(err, callback, msg); }
      return callback(err);
    });

  };
  //-------------------------------------------------------------------------------------------------


  // ------------------------------------------------------------------------------------------------
  //
  //  Run the startup logic (set things up for the above handlers.)
  //

  return sg.__run([function(next) {
    return registerAsServiceApp(appId, mount, appRecord, next);

  }, function(next) {
    return configuration({}, {}, (err, r_) => {
      if (err) { return sg.die(err, callback, `sa_${appName}.addRoutes.configuration`); }

      r = r_;

      _.each(r.result.app_prj, (app_prj, app_prjName) => {
        if (app_prj.app.appId !== appId) { return; }    /* this is not my app */
        //console.log(`my app: ${app_prjName}`, sg.inspect(app_prj));
      });

      return next();
    });

  }, function(next) {

    // TODO: Keep either this function, or the next one

    //
    //  Add routes for the public APIs
    //

    console.log(`  -- foo public routes:`);
    addRoute(appRecord.route, `/xyz`,       xyz, appId);
    addRoute(appRecord.route, `/xyz/*`,     xyz, appId);

    // Add startup notification handler for uploader
    onStart.push(function(port, myIp) {
      const myServiceLocation   = `http://${myIp}:${port}`;

      console.log(`${sg.pad(appId, 35)} [${myServiceLocation}] (for /${mount})`);
      registerMyService();

      function registerMyService() {
        setTimeout(registerMyService, 750);
        registerAsService(appId, myServiceLocation, myIp, 4000);
      }
    });

    return next();

  }, function(next) {

    // TODO: Keep either this function, or the previous one

    //
    //  Add routes for the public APIs
    //

    console.log(`  -- foo public routes:`);
    _.each(r.result.app_prj, (app_prj, app_prjName) => {

      if (app_prj.app.appId !== appId) { return; }    /* this is not my app */

      const [projectId, appName]  = app_prjName.split('_');
      const myMount               = deref(app_prj, [myStack, myColor, 'mount']) || '';

      addRoute(`/:projectId(${projectId})/api/v:version/${appName}`, `/xyz`,       xyz, app_prjName);
      addRoute(`/:projectId(${projectId})/api/v:version/${appName}`, `/xyz/*`,     xyz, app_prjName);

      if (addRawRoute) {
        addRawRoute(`/:projectId(${projectId})/api/v:version/${appName}`, `/xyzBlob`,       xyz, app_prjName);
        addRawRoute(`/:projectId(${projectId})/api/v:version/${appName}`, `/xyzBlob/*`,     xyz, app_prjName);
      }

      // Add startup notification handler for foo
      onStart.push(function(port, myIp) {
        const myServiceLocation   = `http://${myIp}:${port}`;

        console.log(`${sg.pad(app_prjName, 35)} [${myServiceLocation}] (for /${myMount})`);
        registerMyService();

        function registerMyService() {
          setTimeout(registerMyService, 750);
          registerAsService(app_prjName, myServiceLocation, myIp, 4000);
        }
      });
    });

    return next();

  }], function() {
    return callback();
  });

};

_.each(lib, (value, key) => {
  exports[key] = value;
});


