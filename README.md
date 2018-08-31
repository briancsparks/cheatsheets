# cheatsheets
A collection of snippets for various things.

# Template Types

## templates

The original type. Kind of a mis-mash.

## projects

The first improvement.

Currently, there is only one project -- a ReactJs project.

## snips

These work well.


# Meta words

The system uses so-called `meta` words in place of a template system. So, for
example, a template might have something ilke the following. The meta-words will
be repaced -- there are no template tags.

* foo
* bar
* baz
* quxx

```C++
Class foo {
public:
  foo();
  foo(const foo & that);
  ~foo();

};
```

The advantage of meta-words is twofold:

1. The template are full featured documents. The example above will compile as-is. Any
   editor built for your document type will handle these templates correctly. No more
   issues having your edit complain because it doesn't understand your template markup.
2. This means that virtually _every_ document on your system is already a template.


