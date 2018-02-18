const foo           = argvGet(argv, u('foo',  '=foo', 'The foo.'));
if (!foo)           { return u.sage('foo', 'Need foo.', callback); }
