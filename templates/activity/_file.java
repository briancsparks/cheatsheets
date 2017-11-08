package xyz;


public class FooActivity extends AppCompatActivity {



  ///////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // Activity Lifecycle Event Handlers
  ///////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Bootstraps the activity.
   *
   * We only load up the UI, we do not do anything dynamic.
   *
   * @param savedInstanceState
   *
   */
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Recover any saved state
    //if (savedInstanceState != null) {}
  }

  /**
   * Start the activity.
   *
   * The UI was loaded in onCreate(); now we start all the dynamic stuff that
   * the activity does. After onStart() executes, the acitvity will be in the foreground,
   * and is becoming interactive.
   *
   */
  @Override
  protected void onStart() {
    super.onStart();
  }

  /**
   * Finish starting.
   *
   * Generally, onResume() exists to re-start things that onPause() stopped.
   *
   * 1. Start BroadcastReceivers, for example
   *
   */
  @Override
  protected void onResume() {
    super.onResume();
  }

  /**
   * We just lost focus, probably because another app started.
   *
   * We are not dying, yet. But we need to appear static. Stop ram-resident things,
   * but do not save or use the network.
   *
   * 1. Stop BroadcastReceivers
   * 2. Release system handles, like handles to sensors.
   *
   */
  @Override
  protected void onPause() {
    super.onPause();
  }

  /**
   * Save state.
   *
   * @param savedInstanceState
   *
   */
  @Override
  protected void onSaveInstanceState(Bundle savedInstanceState) {
    super.onSaveInstanceState(savedInstanceState);
  }

  /**
   * We are stopping -- another app has become the running app.
   *
   * Save any necessary state -- there is a significant likelihood that onStop
   * will be the very last thing that is run (Android does not guarantee that
   * onDestroy() will be called.)
   *
   * Must coordinate with onSaveInstanceState() on what gets saved where.
   *
   * Release any system resources.
   *
   */
  @Override
  protected void onStop() {
    super.onStop();
  }

  /**
   * Re-animated!
   *
   * Immediately after onRestart() finishes, the system will call onStart().
   *
   */
  @Override
  protected void onRestart() {
    super.onRestart();
  }

  /**
   * We are dying.
   *
   * (Truth be told, onDestroy() gets called on an orientation change, too :( Ugh. )
   *
   * Release anything that has not been released already.
   */
  @Override
  protected void onDestroy() {
    super.onDestroy();

    // Note: call isFinishing() to see if finish() was called -- which is a clean shut-down.
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // Activity Lifecycle Event Handlers - END
  ///////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////

}


