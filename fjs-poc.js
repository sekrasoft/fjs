/// Базовый класс списка
function ListBase() { throw new Error(); }
ListBase.prototype.head = function() { throw new Error(); };
ListBase.prototype.tail = function() { throw new Error(); };

ListBase.prototype.toString = function() {
  return '[' + (function str(list){
    var t = tail(list);
    if(t === Nil) return String(head(list));
    return String(head(list)) + ',' + str(t);
  }(this)) + ']';
};

/// Преоброзование списка в массив
ListBase.prototype.toArray = function() {
  return (function array(list){
    return list === Nil ? [] : [head(list)].concat(array(tail(list)));
  })(this);
};

/// Пустой список
function EmptyList(){ throw new Error(); }
EmptyList.prototype = Object.create(ListBase.prototype);
EmptyList.prototype.toString = function() { return "[]"; };

/// Обычный список
function List(h, t){
  this.h = h;
  this.t = t;
}

List.prototype = Object.create(ListBase.prototype);
List.prototype.head = function() { return this.h; };
List.prototype.tail = function() { return this.t; };

/// Преоброзования массива в список (с копированием элементов)
List.fromArray = function(arr){
  return (function list(arr, cur){
    return cur < arr.length ? Cons(arr[cur], list(arr, cur+1)) : Nil;
  })(arr, 0);
};

/// Ленивый список
function LazyList(h, t){
  this.h = h;
  this.t = t;
  this.h_ = this.t_ = null;
}

LazyList.prototype = Object.create(ListBase.prototype);
LazyList.prototype.head = function() {
  return this.h_ == null ? this.h_ = this.h() : this.h_;
};
LazyList.prototype.tail = function() {
  return this.t_ == null ? this.t_ = this.t() : this.t_;
};

/// Список-прокси, возвращающий элементы массива
function ArrayProxy(array, from){
  this.data = array;
  this.from = from | 0;
  if(array.length <= from) return Nil;
}

ArrayProxy.prototype = Object.create(ListBase.prototype);
ArrayProxy.prototype.head = function() { return this.data[this.from]; };
ArrayProxy.prototype.tail = function() { return new ArrayProxy(this.data, this.from + 1); };
ArrayProxy.fromArray = function(arr){ return new ArrayProxy(arr, 0); };

/// Основные функции и значения
var Nil = Object.create(EmptyList.prototype);
function Const(v){ return function() { return v; }; }
function id(v){ return v; }
function id1(v){ return this; }
function head(list){ return list.head(); }
function tail(list){ return list.tail(); }
function Cons(x, y){ return new List(x, y); }
function ConsL(x, y){ return new LazyList(x, y); }
function AList(arr){ return ArrayProxy.fromArray(arr); }
function $(f, x){ return f.bind(this, x); }
function flip(f){ return function(x,y){ return f(y, x); }; }
function compose(f, g){ return function(x){ return f(g(x)); }; }
function field(name){ return function(x){ return x[name]; }; }
var clone = curry(foldr)(Cons)(Nil);
var reverse = curry(foldl)(flip(Cons))(Nil);
var length = curry(foldl)(function(acc, x){ return acc + 1; })(0);
var sum = curry(foldl)(function(acc, x){ return acc + x; })(0);

function take(n, list){
  // берёт элементы из хвоста list
  // сделано для того, чтобы работало take 1 $ filter (<2) [1..]
  function takeTail(n, list){
    if(n <= 0) return Nil;
    var t = tail(list);
    if(t == Nil) return Nil;
    return ConsL($(head, t), $($(takeTail, n-1), t));
  }

  return list == Nil || n <= 0 ? Nil :
    ConsL($(head, list), $($(takeTail, n - 1), list));
}

function map(f, list){
  return list == Nil ? Nil : ConsL($(compose(f, head), list),
    compose($(map, f), $(tail, list)));
}

function filter(f, list){
  if(list == Nil) return Nil;
  var h = head(list);
  if(f(h)) return ConsL(Const(h), compose($(filter, f), $(tail, list)));
  return filter(f, tail(list));
}

function foldr(f, val, list){
  return list == Nil ? val : f(head(list), foldr(f, val, tail(list)));
}

function foldl(f, val, list){
  return list == Nil ? val : foldl(f, f(val, head(list)), tail(list));
}

function any(f, list){
  return list != Nil && (f(head(list)) || any(f, tail(list)));
}

function all(f, list){
  return list == Nil || f(head(list)) && all(f, tail(list));
}

function nth(n, list){
  if(list == Nil) throw new Error();
  if(n <= 0) return head(list);
  return nth(n-1, tail(list));
}

function concat1(xs, ys){
  return xs == Nil ? ys :
    ConsL($(head, xs), function() { return concat1(tail(xs), ys); });
}

function concat(lists){
  if(lists == Nil) return Nil;
  var xs = head(lists);
  return xs == Nil ? concat(tail(lists)) :
    ConsL($(head, xs), function() { return concat(Cons(tail(xs), tail(lists))); });
}

function iterate(f, a){
  return ConsL(Const(a), function() { return iterate(f, f(a)); });
}

function shift(list){
  return list == Nil ? Nil : concat1(tail(list), Cons(head(list), Nil));
}

function zipWith(f, xs, ys){
  if(xs == Nil || ys == Nil) return Nil;
  return ConsL(function() { return f(head(xs), head(ys)); },
    function() { return zipWith(f, tail(xs), tail(ys)); });
}

function permutations(list){
  
  function shifts(list){ return take(length(list), iterate(shift, list)); }
  
  function ps(lists, n){
    if(n <= 1) return lists;
    return concat(map(function(list){
      var h = head(list);
      return map($(Cons, h), ps(shifts(tail(list)), n - 1));
    }, lists));
  }
  
  return ps(shifts(list), length(list));
}

function sortBy(f, list){
  if(list == Nil) return Nil;
  var h = head(list), t = tail(list);
  return concat1(sortBy(f, filter(function(x){ return f(x, h) < 0; }, t)),
      Cons(h, sortBy(f, filter(function(x){ return f(x, h) >= 0; }, t))));
}

function sort(list){ return sortBy(function(a, b){ return a-b; }, list); }

function unique(list){
  return foldr(function(x, acc){
    if(acc == Nil) return Cons(x, Nil);
    return head(acc) == x ? acc : Cons(x, acc);
  }, Nil, sort(list));
}

function join(str, list){
  return foldl(function(acc, x){
    return acc == '' ? String(x) : acc + str + String(x);
  }, '', list);
}

function curry(f){
  return (function bound(f, n){
    return function apply(x){
      if(n <= 0) return f(x);
      return bound(f.bind(this, x), n-1);
    };
  })(f, f.length - 1);
}

////////////////////////////////////////////////////////////////////////////////
// Использование определённых ранее функций и констант

// add1 = (+1)
var add1 = function(x){ return x + 1; };

/// Бесконечный список натуральных чисел:
// nats = 1 : map (+1) nats
var nats = ConsL(Const(1), function() { return map(add1, nats); });

/// Бесконечный список квадратов натуральных чисел:
// squares = map (\x -> x*x) nats
var squares = map(function(x){ return x*x; }, nats);

/// Бесконечный список простых чисел
/*
  primes = sieve [2..]
    where sieve (p:xs) = p : sieve [x|x <- xs, x `mod` p > 0]
  
  -- http://en.literateprograms.org/Sieve_of_Eratosthenes_%28Haskell%29
*/
var primes = (function sieve(xs){
  function ok(x){ return x % p > 0; }
  var p = head(xs);
  return ConsL(Const(p), $(sieve, filter(ok, tail(xs))));
})(tail(nats));
