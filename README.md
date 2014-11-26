# Infinite Lists And Higher-Order Functions For The JavaScript Language

This library called [FJS](fjs.js) - is just one file that enables you to easily
use infinite lists in the Node.js or in ECMAScript 5 compartible browsers.

The infinite lists in FJS are implemented via lazy constructors.
Of course, there is no lazy evaluation in JavaScript but we may use functions
that evaluate values instead of values itself to emulate the behaviour required.
The library uses three types of list constructors: strict one,
semi-lazy one (a strict head and a lazy tail) and lazy one.
The library also includes some standard well-known functions like map and foldl.

*Вы знаете русский язык? Тогда Вы можете не читать этот перевод,
открыв [**оригинальный текст**](README-RU.md).*

## Quick Start

You may download one file [fjs.js](fjs.js), to start use the library just now.

### Example: Node.js

    var fjs = require('./fjs.js'), _ = {};
    fjs.$import(_, [ 'list.*', 'list.util.*', 'func.*', 'list.std.*' ]);
    
    console.log(String(_.take(10, _.nats))); // [1,2,3,4,5,6,7,8,9,10]
    console.log(String(_.take(10, _.map(function(x){ return x * 2; }, _.nats))));
    console.log(String(_.take(10, _.ConsL(1, _.id1)))); // [1,1,1,1,1,1,1,1,1,1]

### Example: browser

    <script src="fjs.js"></script>
    <script>
    fjs.$import(window, [ 'list.*', 'list.util.*', 'func.*', 'list.std.*' ]);
    
    alert(String(take(10, nats))); // [1,2,3,4,5,6,7,8,9,10]
    alert(String(take(10, map(function(x){ return x * 2; }, nats))));
    alert(String(take(10, ConsL(1, id1)))); // [1,1,1,1,1,1,1,1,1,1]
    </script>

### Demonstration
A [demonstration](https://rawgit.com/sekrasoft/fjs/master/index.html) and
online interpreter.

You also can [download](https://github.com/sekrasoft/fjs/archive/master.zip)
a repository and open index.html in a modern (IE 9+) browser to try and run
some tests.

## Interface
FJS provides an object `fjs` for a browser user of a module for a Node.js user.
It contains:

  - `stdlib` object that contains functions and submodules
  - `$import` function that offers a convenient way
    to import FJS functions from the `stdlib` to a user's object
  - `$export` function for user's objects export

### fjs.stdlib
A standard library contains the following submodules, functions and values:

*All the types are given in a Haskell-like notation for easy understanding.
(But sometimes dynamic typing breaks this convention)
Functions names are Haskell-like too.*

  - `list` - list submodule
    - `Nil = []` - an empty list
    - `Cons :: (a, [a]) -> [a]`
    - `ConsL :: (a, () -> [a]) -> [a]` - semi-lazy list
    - `ConsLL :: (() -> a), () -> [a]) -> [a]` - lazy constructor
    - `List :: Array a -> [a]` - JavaScript Array proxy
    - `AList :: Array a -> [a]` - copies a JavaScript Array
    - `Seq :: (Int -> a, Int) -> [a]` - creates list-like sequence [f(n), f(n+1), f(n+2), ...]
    - `util` - list operations
      - `head :: [a] -> a`
      - `last :: [a] -> a`
      - `tail :: [a] -> [a]`
      - `init :: [a] -> [a]`
      - `length :: [a] -> Number`
      - `isEmpty :: [a] -> Boolean`
      - `reverse :: [a] -> [a]`
      - `take :: (Number, [a]) -> [a]`
      - `drop :: (Number, [a]) -> [a]`
      - `map :: (a -> b, [a]) -> [b]`
      - `filter :: (a -> Boolean, [a]) -> [a]`
      - `foldr :: ((a,b)->b, b, [a]) -> b`
      - `foldl :: ((b,a)->b, b, [a]) -> b`
      - `nth :: (Number, [a]) -> a` - n-th list element
      - `concat1 :: ([a], [a]) -> [a]`
      - `sortBy :: ((a,a) -> Number, [a]) -> [a]`
      - `sort :: [a] -> [a]`
      - `join :: (String, [a]) -> String`
      - `sum :: [Number] -> Number`
      - `product :: [Number] -> Number`
      - `any :: (a -> Boolean, [a]) -> Boolean`
      - `all :: (a -> Boolean, [a]) -> Boolean`
      - `concat :: [[a]] -> [a]`
      - `shift :: [a] -> [a]`
      - `zipWith :: ((a,b) -> c, [a], [b]) -> [c]`
      - `permutations :: [a] -> [[a]]`
      - `unique :: [a] -> [a]`
      - `cycle :: [a] -> [a]`
      - `elem :: (a, [a]) -> Boolean`
      - `notElem :: (a, [a]) -> Boolean`
      - `maximum :: [a] -> a`
      - `minimum :: [a] -> a`
      - `and :: [Boolean] -> Boolean`
      - `or  :: [Boolean] -> Boolean`
      - `foldl1 :: ((a -> a -> a), [a]) -> a`
      - `foldr1 :: ((a -> a -> a), [a]) -> a`
      - `concatMap :: ((a -> [b]), [a]) -> [b]`
      
    - `std` - some well-known infinite lists
      - `nats` - natural numbers
      - `squares` - squares of natural numbers
      - `primes` - prime numbers
      - `ones` - an infinite list of ones
  - `func` - other useful functions
    - `Const :: a -> b -> a`
    - `id :: a -> a`
    - `id1 :: () -> Object a` - returns `this`
    - `$ :: (Function, x) -> Function`
    - `flip :: ((a, b) -> c) -> (b, a) -> c`
    - `compose :: (b -> c, a -> b) -> a -> c`
    - `field :: String -> Object a -> a` - object field getter
    - `curry :: ((a, b) -> c) -> a -> b -> c`
    - `list` - functions related with lists
      - `iterate :: (a -> a, a) -> [a]`
      - `repeat :: a -> [a]`
      - `replicate :: (Number, a) -> [a]`
    - `operators` - a convenient operators and lambdas notation
        (see [operators](#operators))
      - `binary :: String -> (a -> a -> b) | (a -> b) | b`
      - `unary :: String -> (a -> b) | b`
      - `lambda :: String -> Function`

All the lists has the following methods:

*Some functions from the `list.util` are just wrappers on this methods.*

  - `head :: () -> a`
  - `last :: () -> a`
  - `tail :: () -> [a]`
  - `init :: () -> [a]`
  - `isEmpty :: () -> Boolean`
  - `length :: () -> Number`
  - `reverse :: () -> [a]`
  - `take :: Number -> [a]`
  - `drop :: Number -> [a]`
  - `map :: (a -> b) -> [b]`
  - `filter :: (a -> Boolean) -> [a]`
  - `foldr :: ((a,b)->b, b) -> b`
  - `foldl :: ((b,a)->b, b) -> b`
  - `nth :: Number -> a`
  - `concat :: [a] -> [a]`
  - `sortBy :: ((a,a) -> Number) -> [a]`
  - `sort :: () -> [a]`
  - `join :: String -> String`
  - `toString :: () -> String`
  - `toArray :: () -> Array a`
  - `indexOf :: a -> Number`

It's important to note that `head` and `tail` call results are **cached**
to achieve higher perfomance. This does not interfere with the functional
approach but punishes severely everybody who want to break its rules.

You should get the concrete JS-value via `head`, `toString` or `toArray`
in order to do anything imperative what you want.

### fjs.$import
The `fjs.$import` functions offers a convenient way  to import FJS functions
from the `stdlib` to a user's object.

Import the whole library:

    var m = {};
    fjs.$import(m);
    // m.list.Cons === fjs.stdlib.list.Cons
    
Import one value by name:

    var m = {};
    fjs.$import(m, 'list.Cons');
    // m.Cons === fjs.stdlib.list.Cons
    
Import one value by name with the name specified:

    var m = {};
    fjs.$import(m, 'list.Cons:MkList');
    // m.MkList === fjs.stdlib.list.Cons
    
Multiple values import:

    var m = {};
    fjs.$import(m, 'list.*');
    // m.Cons === fjs.stdlib.list.Cons
    
Import multiple sets of values:

    var m = {};
    fjs.$import(m, ['list.*', 'func.$', 'list.util.permutations:perm', '*']);

You can use `fjs.$import` with your submodules (objects) as sources:

    var m = {}, obj = {x: 3, y: 5};
    fjs.$import(m, 'x', obj); // m.x === 3
    fjs.$import(m, ['x', 'y:z'], obj); // m.x === 3, m.z === 5
    fjs.$import(m, obj); // m.x === 3, m.y === 5;

### fjs.$export
The `fjs.$export` function allows you to add your value in an object:

    var x = 9, m = {};
    fjs.$export(m, 'Math.nine', x);
    fjs.$export(m, 'Math.sqrt', Math.sqrt);
    // m.Math.sqrt(m.Math.nine) === 3

## Example
Please close you eyes while I import all the values in the global scope:

    fjs.$import(this, [
      'list.*',
      'list.util.*',
      'list.std.*',
      'func.*',
      'func.list.*' ]);

I cat still use the full names but it's so boring:

    fjs.stdlib.list.Cons(1, fjs.stdlib.list.Nil) // [1]
  
An infinite list of the natural numbers:

    take(10, nats) // [1,2,3,4,5,6,7,8,9,10]
    nats.take(10) // [1,2,3,4,5,6,7,8,9,10]
    
The 100'th prime number:

    nth(99, primes) // 541
    primes.nth(99) // 541
    
Different ways to construct a list:

    Cons(1, Cons(2, Cons(3, Nil))) // [1,2,3]
    ConsL(1, Const(ConsL(2, Const(Cons(3, Nil))))) // [1,2,3]
    ConsLL(Const(1), Const(ConsLL(Const(2), Const(Cons(3, Nil))))) // [1,2,3]
    ConsL(1, function(){ return Nil; }) // [1]
    ConsLL(function(){ return 1; }, function(){ return Nil; }) // [1]
    
Conversion between lists and JS-arrays:

    // Creating of array copy (useful when the source array is short or will not be changed
    AList([1,2,3]) // [1,2,3]
    
    // Creating of array proxy (useful when the source array will not be changed)
    List([1,2,3]) // [1,2,3]
    
    // Conversion to the JS-array
    take(5, nats).toArray() // [1,2,3,4,5]

Sequences (see [infinite lists](#own_infinite_lists)):

*Sequences do not cache its tails and also may save you from stack overflow
if you define it via `map` on itself.*

    // Sequence of ones
    var ones = Seq(Const(1), 1);
    take(10, ones) // [1,1,1,1,1,1,1,1,1,1]

    // Odd numbers
    var odds = Seq(function(x){ return x * 2 + 1; }, 0);
    take(10, odds) // [1,3,5,7,9,11,13,15,17,19]
    
    // Squares
    var squares = Seq(function(x){ return x * x; }, 1);
    take(10, squares) // [1,4,9,16,25,36,49,64,81,100]
    
List/AList can be used with strings or other array-like objects because of duck typing:

    List('hello') // ['h','e','l','l','o']
    join("", unique(List("Hello world"))) // 'wroledH'
    
    function fun() {
       return List(arguments);
    }
    fun(1,2,3,4) // [1,2,3,4]
    
Head and tail:

    head(List([1,2,3])) // 1
    tail(List([1,2,3])) // [2,3]
    tail(tail(List([1,2,3]))) // [3]
    head(tail(tail(List([1,2,3])))) // 3
    
Transformations:

    map(function(x){ return x+1; }, take(5, nats)) // [2,3,4,5,6]
    filter(function(x){ return x%2; }, take(5, nats)) // [1,3,5]
    shift(take(5, nats)) // [2,3,4,5,1]

You should not mix pure functional lists with your ugly imperativeness:

    var log = function(x) {
      console.log(x);
      return x + 10;
    }
    
    var xs = take(5, nats);
    
    // Please, stop it! Nothing will be printed because map function is lazy (for now)
    var printed = xs.map(log);
    
    var x = head(printed); // you get some output only now; x is 11
    var y = head(printed); // head(printed) is cached so
      // nothing is printed; y is 11
    
    // You should come back to your imperative world to continue:
    var numbers = xs.toArray(); // JS-array that waits for your actions
    var printed = numbers.map(log); // all right
    
Sorting and unique sets:

    sort(List([3,8,2,1])) // [1,2,3,8]
    unique(List([1,2,1,3,2,2])) // [3,2,1]

Predicates and folds:

    var xs = take(5, nats);
    any(function(x){ return x > 3; }, xs) // true
    all(function(x){ return x > 3; }, xs) // false
    foldl(function(acc, x){ return acc*x; }, 1, xs) // 120
    product(xs) // 120
    sum(xs) // 15

Reverse and clone lists via folds:

    var reverse = $($(foldl, flip(Cons)), Nil), clone = curry(foldr)(Cons)(Nil);
    reverse(take(5, nats)) // [5,4,3,2,1]
    clone(take(5, nats)) // [1,2,3,4,5]

Due to dynamic typing you can do something that is denied in Haskell:

    take(5, iterate($(flip(Cons), Nil), Nil)) // [[],[[]],[[[]]],[[[[]]]],[[[[[]]]]]]

<a name="operators"></a>A convenient operators ans lambdas notation:

*Warning: the following functions use <b>eval</b>.
You should use ordinary JS-functions instead of this functions to
achieve security and perfomance.*

    fjs.$import(this, [
      'func.operators.unary:un',
      'func.operators.binary:bin',
      'func.operators.lambda' ]);
      
    // Unary operators: '++', '--', '+', '-', '!', '~'
    un('-')(1) // -1
    
    // Binary operations: '+', '-', '*', '/', '%', ',', '&&', '||',
    // '===', '!==', '==', '!=', '>>>', '>>',
    // '<<', '>=', '>', '<=', '<', '&', '|', '^', '.'
    bin('-')(8, 5) // 3
    bin('8-')(5) // 3
    bin('-5')(8) // 3
    
    bin('.x')({x: 3}) // 3
    
    // Lambdas
    lambda('x -> x*x')(2) // 4
    lambda('x,y -> x+y')(2, 5) // 7
    
    // Usage
    map(bin('+1'), List([1,2,3])) // [2,3,4]

All the permutations of the the first prime numbers:

    permutations(take(3, primes)) // [[2,3,5],[2,5,3],[3,5,2],[3,2,5],[5,2,3],[5,3,2]]

Iterate function:

    var mul2 = function(x){ return 2 * x; };
    take(10, iterate(mul2, 2)) // [2,4,8,16,32,64,128,256,512,1024]

<a name="own_infinite_lists"></a>Your own infinite lists:

    // List of ones: ones = 1 : ones
    var ones = ConsL(1, function(){ return ones; });
    take(10, ones) // [1,1,1,1,1,1,1,1,1,1]

    // JavaScript provides a wonderful opportunity to shorter the code
    // id1 returns 'this'. tail - is a list method so id1 returns the list
    var ones = ConsL(1, id1);
    take(10, ones) // [1,1,1,1,1,1,1,1,1,1]
    
    // Odd numbers: odds = 1 : map (+2) odds
    var odds = ConsL(1, function(){
      return odds.map(function(x){ return x + 2; });
    });
    take(10, odds) // [1,3,5,7,9,11,13,15,17,19]

    // A 'tail' method will called in order to evaluate the tail
    // (it's implementation is passed to 'ConsL'),
    // 'this' for 'tail' is the current list element that head may be got
    var odds = ConsL(1, function next(){
      return ConsL(this.head() + 2, next);
    });
    take(10, odds) // [1,3,5,7,9,11,13,15,17,19]
    
    // Fibonacci numbers: fibs = 1 : 1 : zipWith (+) fibs (tail fibs)
    var plus = function(x,y){ return x+y; },
    fibs = Cons(1, ConsL(1,
      function(){ return zipWith(plus, fibs, tail(fibs)); }));
    take(10, fibs) // [1,1,2,3,5,8,13,21,34,55]

    // Squares: squares = map (\x -> x*x) nats
    var squares = map(function(x){ return x * x; }, nats);
    take(10, squares) // [1,4,9,16,25,36,49,64,81,100]
    
Field getters:

    map(field("x"), List([
      {x: 3},
      {x: 4, y: 5}
    ])) // [3,4]

    field('length')([1,1,1]) // 3
