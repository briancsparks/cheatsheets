
#include "foo.hpp"

using namespace baz;

foo::foo()
  : data(new int[10])
{
}

foo::foo(foo const & that)
  : data(nullptr)
{
  __copy_that(that);
}

foo::foo(foo && that)
{
  if (data != nullptr) {
    delete[] data;
  }

  data = that.data;

  delete[] that.data;
  that.data = nullptr;
}

foo::~foo()
{
}

foo & foo::operator=(foo const & that)
{
  __copy_that(that);
  return *this;
}

foo & foo::operator=(foo && that)
{
  if (this != &that) {
    if (data != nullptr) {
      delete[] data;
    }

    data = that.data;

    delete[] that.data;
    that.data = nullptr;
  }

  return *this;
}

foo & foo::__copy_that(foo const & that)
{
  if (this != &that) {
    if (data != nullptr) {
      delete[] data;
    }

    data = new int[10];
    memcpy(data, that.data, 10 * sizeof(int));
  }

  return *this;
}



