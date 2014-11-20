(function(){

////////////////////////////////////////////////////////////////////////////////
/// Базовый класс списка
function ListBase() { throw new Error(); }
ListBase.prototype.head = function() { throw new Error(); };
ListBase.prototype.tail = function() { throw new Error(); };

ListBase.prototype.length = function(){
  var t = this, len = 0;
  do {
    t = t.tail();
    ++ len;
  } while(t !== Nil);
  return len;
};

ListBase.prototype.reverse = function(){
  var res = Nil, t = this;
  do {
    res = new List(t.head(), res);
    t = t.tail();
  } while(t !== Nil)
  return res;
};

ListBase.prototype.take = function(n){
  var list = this;
  
  // берёт элементы из хвоста list
  // сделано для того, чтобы работало take 1 $ filter (<2) [1..]
  function takeTail(n, list){
    if(n <= 0) return Nil;
    var t = list.tail();
    if(t === Nil) return Nil;
    return new LazyList(function(){ return t.head(); },
      function() { return takeTail(n-1, t); });
  }
  
  if(n <= 0) return Nil;

  return new LazyList(function(){ return list.head(); },
    function(){ return takeTail(n - 1, list); });
}

ListBase.prototype.map = function(f){
  var list = this;
  return new LazyList(function(){ return f(list.head()); },
    function() { return list.tail().map(f); });
};

ListBase.prototype.filter = function(f){
  var t = this;
  while(true) {
    var h = t.head();
    if(f(h)) return new LazyList1(h, function() { return t.tail().filter(f); });
    t = t.tail();
    if(t === Nil) return Nil;
  }
};

ListBase.prototype.foldr = function foldr(f, val){
  var s = this.toArray(), res = val;
  for(var i=s.length-1; i>=0; --i) res = f(s[i], res);
  return res;
};

ListBase.prototype.foldl = function foldl(f, val){
  var res = val, t = this;
  do{
    res = f(res, t.head());
    t = t.tail();
  }while(t !== Nil);
  return res;
};

ListBase.prototype.nth = function nth(n){
  var t = this;
  do{
    if(!n) return t.head();
    t = t.tail();
    --n;
  }while(t !== Nil);
};

ListBase.prototype.concat = function(ys){
  var xs = this;
  return new LazyList(function(){ return xs.head(); },
    function() { return xs.tail().concat(ys); });
};

ListBase.prototype.sortBy = function(f){
  var h = this.head(), t = this.tail();
  var hs = t.filter(function(x){ return f(x, h) <  0; }).sortBy(f);
  var ts = t.filter(function(x){ return f(x, h) >= 0; }).sortBy(f);
  return hs.concat(new List(h, ts));
};

ListBase.prototype.sort = function(){
  var h = this.head(), t = this.tail();
  var hs = t.filter(function(x){ return x <  h; }).sort();
  var ts = t.filter(function(x){ return x >= h; }).sort();
  return hs.concat(new List(h, ts));
}

ListBase.prototype.join = function(str){
  return this.foldl(function(acc, x){
    return acc === '' ? String(x) : acc + str + String(x);
  }, '');
};

ListBase.prototype.toString = function() {
  var t = this.tail();
  if(t === Nil) return '[' + String(this.head()) + ']';
  
  var str = '[' + String(this.head());
  
  do {
    str += ',' + String(t.head());
  } while((t = t.tail()) !== Nil);
  
  return str + ']';
};

ListBase.prototype.toArray = function() {
  var arr = Array(this.length()), list = this;
  for(var i=0; i<arr.length; ++i){
    arr[i] = list.head();
    list = list.tail();
  }
  return arr;
};

////////////////////////////////////////////////////////////////////////////////
/// Пустой список
function EmptyList(){ throw new Error(); }
EmptyList.prototype = Object.create(ListBase.prototype);
EmptyList.prototype.length = function(){ return 0; };
EmptyList.prototype.reverse = function(){ return this; };
EmptyList.prototype.take = function(n){ return this; };
EmptyList.prototype.map = function(f){ return this; };
EmptyList.prototype.filter = function(f){ return this; };
EmptyList.prototype.foldr = function(f, val){ return val; };
EmptyList.prototype.foldl = function(f, val){ return val; };
EmptyList.prototype.nth = function(n){};
EmptyList.prototype.concat = function(ys){ return ys; };
EmptyList.prototype.sortBy = function(f){ return this; };
EmptyList.prototype.sort = function(){ return this; };
EmptyList.prototype.toString = function() { return "[]"; };

////////////////////////////////////////////////////////////////////////////////
/// Обычный список
function List(h, t){
  this.h = h;
  this.t = t;
}

List.prototype = Object.create(ListBase.prototype);
List.prototype.head = function() { return this.h; };
List.prototype.tail = function() { return this.t; };

/// Преоброзования массива в список (с копированием элементов)
function arrayToList(arr){
  if(!arr.length) return Nil;
  
  var list = Nil;
  for(var i=arr.length - 1; i >= 0; --i) list = new List(arr[i], list);
  return list;
};

////////////////////////////////////////////////////////////////////////////////
// Особые списки

/// Ленивый список
function LazyList(h, t){
  this.h = h;
  this.t = t;
  this.h_ = this.t_ = undefined;
}

LazyList.prototype = Object.create(ListBase.prototype);
LazyList.prototype.head = function() {
  return this.h_ === undefined ? this.h_ = this.h() : this.h_;
};
LazyList.prototype.tail = function() {
  return this.t_ === undefined ? this.t_ = this.t() : this.t_;
};

/// Список с ленивым концом
function LazyList1(h, t){
  this.h = h;
  this.t = t;
  this.t_ = undefined;
}

LazyList1.prototype = Object.create(ListBase.prototype);
LazyList1.prototype.head = function() { return this.h; };
LazyList1.prototype.tail = function() {
  return this.t_ === undefined ? this.t_ = this.t() : this.t_;
};

/// Список-прокси, возвращающий элементы массива
function ArrayProxy(array, from){
  this.data = array;
  this.from = from | 0;
  if(array.length <= from) return Nil;
}

ArrayProxy.prototype = Object.create(ListBase.prototype);
ArrayProxy.prototype.head = function() { return this.data[this.from]; };
ArrayProxy.prototype.tail = function() {
  return new ArrayProxy(this.data, this.from + 1);
};

/// Последовательность как обёртка над функцией: ((Int -> a), Int) -> [a]
function Sequence(func, from){
  this.func = func;
  this.from = from | 0;
  this.value_ = undefined;
}

Sequence.prototype = Object.create(ListBase.prototype);
Sequence.prototype.head = function() {
  return this.value_ === undefined ? this.value_ = this.func(this.from) : this.value_;
};
Sequence.prototype.tail = function() {
  return new Sequence(this.func, this.from + 1);
};

////////////////////////////////////////////////////////////////////////////////
// Основные функции и значения

var Nil = Object.create(EmptyList.prototype);

function sum(list){
  return list.foldl(function(acc, x){ return acc + x; }, 0);
}

function product(list){
  return list.foldl(function(acc, x){ return acc * x; }, 1);
}

function any(f, list){
  var t = list;
  while(t !== Nil){
    if(f(t.head())) return true;
    t = t.tail();
  }
  return false;
}

function all(f, list){
  var t = list;
  while(t !== Nil){
    if(!f(t.head())) return false;
    t = t.tail();
  }
  return true;
}

function concat(lists){
  var t = lists, h;
  while(t !== Nil){
    var xs = t.head();
    if(xs !== Nil) return new LazyList(function(){ return xs.head(); },
      function() { return concat(new List(xs.tail(), t.tail())); });
    t = t.tail();
  }
  return Nil;
}

function iterate(f, a){
  return new LazyList1(a, function(){ return iterate(f, f(a)); });
}

function shift(list){
  if(list === Nil) return Nil;
  return list.tail().concat(new List(list.head(), Nil));
}

function zipWith(f, xs, ys){
  if(xs === Nil || ys === Nil) return Nil;
  return new LazyList(function() { return f(xs.head(), ys.head()); },
    function() { return zipWith(f, xs.tail(), ys.tail()); });
}

function permutations(list){
  
  function shifts(list){ return iterate(shift, list).take(list.length()); }
  
  // TODO: rewrite
  function ps(lists, n){
    if(n <= 1) return lists;
    return concat(lists.map(function(list){
      var h = list.head();
      return ps(shifts(list.tail()), n - 1).
        map(function(x){ return new List(h, x); });
    }));
  }
  
  return ps(shifts(list), list.length());
}

function unique(list){
  if(list === Nil) return Nil;
  
  var t = list.sort(), cur = list.head();
  var res = new List(cur, Nil);
  
  while((t = t.tail()) !== Nil){
    var h = t.head();
    if(h === cur) continue;
    res = new List(h, res);
    cur = h;
  }
  
  return res;
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
/// Стандартная библиотека
var stdlib = {
  'list': {
    'Nil': Nil,
    'Cons': function Cons(x, y){ return new List(x, y); },
    'ConsL': function ConsL(x, y){ return new LazyList1(x, y); },
    'ConsLL': function ConsLL(x, y){ return new LazyList(x, y); },
    'Seq': function Seq(f, from){ return new Sequence(f, from); },
    
    'List': function AList(arr){ return new ArrayProxy(arr, 0); },
    'AList': arrayToList,
    
    'util': {
      'head': function head(list){ return list.head(); },
      'tail': function tail(list){ return list.tail(); },
      'length': function length(list){ return list.length(); },
      'reverse': function(list){ return list.reverse(); },
      'take': function(n, list){ return list.take(n); },
      'map': function(f, list){ return list.map(f); },
      'filter': function(f, list){ return list.filter(f); },
      'foldr': function(f, val, list){ return list.foldr(f, val); },
      'foldl': function(f, val, list){ return list.foldl(f, val); },
      'nth': function(n, list){ return list.nth(n); },
      'concat1': function(xs, ys){ return xs.concat(ys); },
      'sortBy': function(f, list){ return list.sortBy(f); },
      'sort': function(list){ return list.sort(); },
      'join': function(str, list){ return list.join(str); },
      
      'sum': sum,
      'product': product,
      'any': any,
      'all': all,
      'concat': concat,
      'shift': shift,
      'zipWith': zipWith,
      'permutations': permutations,
      'unique': unique,
    }
  },
  
  'func': {
    'Const': function Const(v){ return function() { return v; }; },
    'id': function id(v){ return v; },
    'id1': function id1(v){ return this; },
    '$': function $(f, x){ return f.bind(this, x); },
    'flip': function flip(f){ return function(x,y){ return f(y, x); }; },
    'compose': function compose(f, g){ return function(x){ return f(g(x)); }; },
    'field': function field(name){ return function(x){ return x[name]; }; },
    'curry': curry,

    'iterate': iterate,
  },
  
};

////////////////////////////////////////////////////////////////////////////////
// Работа с модулями

function has(obj, field){
  return Object.hasOwnProperty.call(obj, field);
}

function getField(object, name){
  var names = name.split('.');
  for(var i=0; i<names.length; ++i){
    if(typeof object === 'object' && object && has(object, names[i]))
      object = object[names[i]];
    else
      throw new Error('Cannot get "' + name + '": cannot get ' + names[i] + ' of ' + object);
  }
  return object;
}

function setField(object, name, value){
  var names = name.split('.');
  if(!names.length || typeof object !== 'object' || !object)
    throw new Error('Cannot set "' + name + '" of ' + object);
  
  for(var i=0; i<names.length - 1; ++i){
    if(has(object, names[i])){
      var field = object[names[i]];
      if(typeof field === 'object' && field) object = field;
      else throw Error('Cannot set "' + name + '": cannot set ' + names[i] + ' of ' + object);
    }else{
      object = object[names[i]] = Object.create(null);
    }
  }
  
  var lastName = names[names.length-1];
  if(has(object, lastName))
    throw new Error('Cannot set "' + name + '": cannot set ' + lastName + ' of ' + object);
  object[lastName] = value;
}

function setFieldAs(to, from, query){
  var m0 = /^([a-zA-Z0-9\.\$\_]+)\.\*$|^\*$/.exec(query);
  if(m0){
    var obj = m0[1] ? getField(from, m0[1]) : from;
    if(typeof obj !== 'object' || !obj)
      throw new Error('Cannot export non-object "' + query + '" from ' + obj);
    
    for(var name in obj)
      if(has(obj, name))
        to[name] = obj[name];
    return;
  }
  
  var m1 = /^([a-zA-Z0-9\.\$\_]+)(?:\:([a-zA-Z0-9\.\$\_]+))?$/.exec(query);
  if(!m1) throw new Error('Invalid export format "' + query + '"');
  var path = m1[1], name = m1[2];
  if(!name){
    var m2 = /\.?([a-zA-Z0-9\$\_]+)$/.exec(path);
    if(!m2) throw new Error('Invalid path "' + path + '"');
    name = m2[1];
  }
  to[name] = getField(from, path);
}

function $import(object, what, _from){
  var from;
  if(typeof _from === 'object' && _from) from = _from;
  else from = stdlib;

  if(what instanceof Array){
    for(var i=0; i<what.length; ++i)
      setFieldAs(object, from, what[i]);
    return;
  }
  
  if(typeof what === 'string'){
    setFieldAs(object, from, what);
    return;
  }
  
  if(typeof _from === 'undefined' && typeof what === 'object' && what){
    from = what;
    what = void 0;
  }

  for(var name in from)
    if(has(from, name))
      object[name] = from[name];
}

function $export(object, name, module){
  if(typeof name !== 'string') throw new Error('Invalid name ' + name);
  setField(object, name, module);
}

////////////////////////////////////////////////////////////////////////////////
// Использование определённых ранее функций и констант

(function(){

  var _ = {};
  $import(_, ['list.ConsL', 'func.id1', 'func.id', 'func.$', 'list.Seq']);
  
  /// Бесконечный список простых чисел
  // http://en.literateprograms.org/Sieve_of_Eratosthenes_%28Haskell%29
  var primes = (function sieve(xs){
    function ok(x){ return x % p > 0; }
    var p = xs.head();
    return _.ConsL(p, _.$(sieve, xs.tail().filter(ok)));
  })(_.Seq(_.id, 2));
  
  // Бесконечный список натуральных чисел
  $export(stdlib, 'list.std.nats', _.Seq(_.id, 1));
  // Бесконечный список квадратов натуральных чисел:
  $export(stdlib, 'list.std.squares', _.Seq(function(x){ return x*x; }, 1));
  $export(stdlib, 'list.std.primes', primes);
  $export(stdlib, 'list.std.ones', _.ConsL(1, _.id1));

})();

////////////////////////////////////////////////////////////////////////////////
// Демонстрация и экспорт для Node.js

if(typeof require !== 'undefined') (function main(){

  exports['stdlib'] = stdlib;
  exports['$import'] = $import;
  exports['$export'] = $export;
  
  if(require.main !== module) return;
  
  var _ = {};
  $import(_, ['list.std.*', 'list.List', 'list.util.permutations:perms']);
  
  console.log(String(_.List([1,2,3,4,5,6]).filter(function(x){ return x > 2; })));

  console.log('ten natural numbers: ' + _.nats.take(10));
  console.log('ten squares: ' + _.squares.take(10));
  console.log('ten primes: ' + _.primes.take(10));
  console.log('Permutations:\n  ' + _.perms(_.primes.take(4)).join('\n  '));
  console.log('100th prime: ' + _.primes.nth(99));
  console.log('OK');
  
})();

////////////////////////////////////////////////////////////////////////////////
// Экспорт для браузеров

if(typeof window !== 'undefined') (function main(){
  var fjs = window['fjs'] = {};
  fjs['stdlib'] = stdlib;
  fjs['$import'] = $import;
  fjs['$export'] = $export;
})();

})();
