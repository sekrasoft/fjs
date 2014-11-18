#Работа с бесконечными списками и ФВП в JS

Библиотека [FJS](fjs.js) - это единственный файл,
который позволит вам легко работать с бесконечными списками
в Node.js или браузере, поддерживающем ECMAScript 5.
Бесконечные списки работают за счёт ленивых конструкторов.

## Быстрый старт

Скачав всего один файл [FJS](fjs.js), вы можете начать работать прямо сейчас.

### Пример работы в Node.js:

    var fjs = require('./fjs.js'), _ = {};
    fjs.$import(_, [ 'list.*', 'list.util.*', 'func.*', 'list.std.*' ]);
    
    console.log(String(_.take(10, _.nats))); // 10 натуральных чисел
    console.log(String(_.take(10, _.map(function(x){ return x * 2; }, _.nats))));

### Пример работы в браузере:

    fjs.$import(window, [ 'list.*', 'list.util.*', 'func.*', 'list.std.*' ]);
    alert(String(take(10, nats)));

### Демонстрация возможностей
[Демонстрация](https://rawgit.com/sekrasoft/fjs/master/index.html) возможностей и мини-интерпретатор на одной странице

Вы также можете [загрузить](https://github.com/sekrasoft/fjs/archive/master.zip)
репозиторий и открыть index.html в более-менее современном браузере (IE 9+).
В демонстрацию встроены автоматические тесты.

## Интерфейс библиотеки
FJS предоставляет пользователю браузера объект `fjs` (пользователю Node.js - модуль),
содержащий
  - объект `stdlib` с нужными функциями и подмодулями
  - функцию `$import` для удобного импорта функций и подмодулей из `stdlib`
  - функцию `$export` для удобного экспорта своих объектов

### fjs.stdlib
Стандартная библиотека содержит следующие подмодули, функции и значения:
(Для простоты типы указаны в нотации, близкой к Haskell, с точностью до динамической типизации; названия функций - тоже из Haskell, если это возможно)

  - `list` - подмодуль работы со списками
    - `Nil = []` - пустой список
    - `Cons :: (a, [a]) -> [a]`
    - `ConsL :: (a, () -> [a]) -> [a]` - конструктор списка с ленивым концом
    - `ConsLL :: (() -> a), () -> [a]) -> [a]` - ленивый конструктор списка
    - `List :: Array a -> [a]` - список-прокси для массива
    - `AList :: Array a -> [a]` - список-копия для массива
    - `util` - операции над списками
      - `head :: [a] -> a`
      - `tail :: [a] -> [a]`
      - `length :: [a] -> Number`
      - `reverse :: [a] -> [a]`
      - `take :: (Number, [a]) -> a`
      - `map :: (a -> b, [a]) -> [b]`
      - `filter :: (a -> Boolean, [a]) -> [a]`
      - `foldr :: ((a,b)->b, b, [a]) -> b`
      - `foldl :: ((b,a)->b, b, [a]) -> b`
      - `nth :: (Number, [a]) -> a` - n-ый элемент списка
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
    - `std` - некоторые стандартные бесконечные списки
      - `nats` - бесконечный список натуральных чисел
      - `squares` - бесконечный список квадратов натуральных чисел
      - `primes` - бесконечный список простых чисел
      - `ones` - бесконечный список единиц
  - `func` - прочие функции
    - `Const :: a -> b -> a`
    - `id :: a -> a`
    - `id1 :: () -> Object a` - возвращает `this`
    - `$ :: (Function, x) -> Function`
    - `flip :: ((a, b) -> c) -> (b, a) -> c`
    - `compose :: (b -> c, a -> b) -> a -> c`
    - `field :: String -> Object a -> a` - геттер для поля: `field('x')({x: 3}) === 3`
    - `curry :: ((a, b) -> c) -> a -> b -> c`
    - `iterate :: (a -> a, a) -> [a]`

У каждого списка определены следующие методы:
(Некоторые функции из `list.util` - обёртки над этими методами)

  - `head :: () -> a`
  - `tail :: () -> [a]`
  - `length :: () -> Number`
  - `reverse :: () -> [a]`
  - `take :: Number -> a`
  - `map :: (a -> b) -> [b]`
  - `filter :: (a -> Boolean) -> [a]`
  - `foldr :: ((a,b)->b, b) -> b`
  - `foldl :: ((b,a)->b, b) -> b`
  - `nth :: Number -> a`
  - `concat :: [a] -> [a]`
  - `sortBy :: ((a,a) -> Number) -> [a]`
  - `sort :: () -> [a]`
  - `join :: String -> String`

### fjs.$import
Функция `fjs.$import` позволяет импортировать нужные сущности из `stdlib` в указанный объект
Импорт всего в `m`:

    var m = {};
    fjs.$import(m);
    // m.list.Cons === fjs.stdlib.list.Cons
    
Импорт значения по имени:

    var m = {};
    fjs.$import(m, 'list.Cons');
    // m.Cons === fjs.stdlib.list.Cons
    
Импорт значения с указанным именем:

    var m = {};
    fjs.$import(m, 'list.Cons:MkList');
    // m.MkList === fjs.stdlib.list.Cons
    
Импорт множества значений:

    var m = {};
    fjs.$import(m, 'list.*');
    // m.Cons === fjs.stdlib.list.Cons
    
Импорт нескольких значений/групп - перечислением в массиве:

    var m = {};
    fjs.$import(m, ['list.*', 'func.$', 'func.permutations:perm', '*']);

### fjs.$export
Функция `fjs.$export` позволяет добавить в свой объект свою функцию

    var x = 9, m = {};
    fjs.$export(m, 'Math.nine', x);
    fjs.$export(m, 'Math.sqrt', Math.sqrt);
    // m.Math.sqrt(m.Math.nine) === 3

## Примеры работы
Пока никто не видит, импортируем для удобства все сущности из `stdlib` в глобальное пространство имён:

    fjs.$import(this, [ 'list.*', 'list.util.*', 'func.*', 'list.std.*' ]);

По полному имени обращаться всё ещё можно, но это слишком длинно:

    fjs.stdlib.list.Cons(1, fjs.stdlib.list.Nil)
  
Натуральные числа (nats - бесконечный их список)

    take(10, nats) // [1,2,3,4,5,6,7,8,9,10]
    nats.take(10) // [1,2,3,4,5,6,7,8,9,10]
    
Сотое простое число

    nth(99, primes) // 541
    primes.nth(99) // 541
    
Использование конструкторов списка

    Cons(1, Cons(2, Cons(3, Nil))) // [1,2,3]
    ConsL(1, Const(ConsL(2, Const(Cons(3, Nil))))) // [1,2,3]
    ConsLL(Const(1), Const(ConsLL(Const(2), Const(Cons(3, Nil))))) // [1,2,3]
    ConsL(1, function(){ return Nil; }) // [1]
    ConsLL(function(){ return 1; }, function(){ return Nil; }) // [1]
    
Списки из массива

    AList([1,2,3]) // элементы массива скопировались
    List([1,2,3]) // список-прокси, возвращающий элементы массива
    
Благодаря утиной типизации, List может проксировать и строки

    List('hello') // ['h','e','l','l','o']
    join("", unique(List("Hello world"))) // 'wroledH'
    
Голова и хвост списка

    head(List([1,2,3])) // 1
    tail(List([1,2,3])) // [2,3]
    tail(tail(List([1,2,3]))) // [3]
    
Преобразования списка

    map(function(x){ return x+1; }, take(5, nats)) // [2,3,4,5,6]
    filter(function(x){ return x%2; }, take(5, nats)) // [1,3,5]
    shift(take(5, nats)) // [2,3,4,5,1]
    
Сортировка и уникальные элементы

    sort(List([3,8,2,1])) // [1,2,3,8]
    unique(List([1,2,1,3,2,2])) // [3,2,1]

Предикаты и свёртки

    var xs = take(5, nats);
    any(function(x){ return x > 3; }, xs) // true
    all(function(x){ return x > 3; }, xs) // false
    foldl(function(acc, x){ return acc*x; }, 1, xs) // 120
    product(xs) // 120
    sum(xs) // 15

Разворот и клонирование через свёртки

    var reverse = $($(foldl, flip(Cons)), Nil), clone = curry(foldr)(Cons)(Nil);
    reverse(take(5, nats)) // [5,4,3,2,1]
    clone(take(5, nats)) // [1,2,3,4,5]

Благодаря динамической типизации можно делать то, что нельзя в Haskell:

    take(5, iterate($(flip(Cons), Nil), Nil)) // [[],[[]],[[[]]],[[[[]]]],[[[[[]]]]]]

Все перестановки первых трёх простых чисел

    permutations(take(3, primes)) // [[2,3,5],[2,5,3],[3,5,2],[3,2,5],[5,2,3],[5,3,2]]

Функция iterate

    var mul2 = function(x){ return 2 * x; };
    take(10, iterate(mul2, 2)) // [2,4,8,16,32,64,128,256,512,1024]

Создание своих бесконечных списков

    // Список единиц: ones = 1 : ones
    var ones = ConsL(1, function(){ return ones; });
    take(10, ones) // [1,1,1,1,1,1,1,1,1,1]

    // небольшой подарок от JavaScript позволяет записать список единиц короче
    // id1 возвращает this. поскольку tail - метод списка, id1 его и возвратит
    var ones = ConsL(1, id1);
    take(10, ones) // [1,1,1,1,1,1,1,1,1,1]
    
    // Нечётные числа: odds = 1 : map (+1) odds
    var odds = ConsL(1, function(){
      return odds.map(function(x){ return x + 2; });
    });
    take(10, odds) // [1,3,5,7,9,11,13,15,17,19]

    // Для получения хвоста вызовется метод `tail` (реализацию его передаём в ConsL),
    // `this` для которого - текущий элемент списка, у которого мы можем посчитать голову
    var odds = ConsL(1, function next(){
      return ConsL(this.head() + 2, next);
    });
    take(10, odds) // [1,3,5,7,9,11,13,15,17,19]
    
    // Числа Фибоначчи: fibs = 1 : 1 : zipWith (+) fibs (tail fibs)
    var plus = function(x,y){ return x+y; },
    fibs = Cons(1, ConsL(1,
      function(){ return zipWith(plus, fibs, tail(fibs)); }));
    take(10, fibs) // [1,1,2,3,5,8,13,21,34,55]

Работа с полями объектов

    map(field("x"), List([
      {x: 3},
      {x: 4, y: 5}
    ])) // [3,4]

    field('length')([1,1,1]) // 3