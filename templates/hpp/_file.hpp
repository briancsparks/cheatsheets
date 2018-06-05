
#ifndef __BAR_HPP__
#define __BAR_HPP__

#include <string>

namespace baz {

  using std::string;

  class foo {
  public:
    foo();
    foo(foo const & that);
    foo(foo && that);
    virtual ~foo();

    foo & operator=(foo const & that);
    foo & operator=(foo && that);

    int *   data;

  private:
    foo & __copy_that(foo const & that);
  };

};

#endif    // __BAR_HPP__

