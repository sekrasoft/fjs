var print = function(){};

(function(){

  function setImmediate(f){ return setTimeout(f, 0); }
  
  function line(f){
    var lines = f.toString()
      .match(/\/\*[\r\n]*([\s\S]*)[\r\n]*\*\//)[1]
      .split(/\r\n|\r|\n/);
    var tab = Math.min.apply(Math, lines.map(function(x){
      if(/^\s*$/.test(x)) return Infinity;
      return x.match(/^\s*/)[0].length; 
    }));
    if(tab){
      var tabRE = new RegExp('^\\s{1,' + tab + '}');
      return lines
        .map(function(x){ return x.replace(tabRE, ''); })
        .join('\n');
    }
    return lines.join('\n');
  }
  
  function safe(f){
    return function(s){
      try{
        return f(s);
      } catch(e) {
        return 'Error: ' + e.message;
      }
    };
  }
  
  function setText(obj, text){
    if(obj.textContent !== undefined)
      obj.textContent = text;
      
    obj.innerHTML = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/\r\n|\r|\n/g, '<br>');
  }

  var UI = {};
  for(var i in {
    'examples': 0,
    'yourSrc': 0,
    'execYourSrc': 0,
    'cleanYourSrc': 0,
    'yourOutput': 0,
    'examplesTitle': 0,
    'container': 0
  }) UI[i] = document.getElementById(i);

  var nerrors = 0;
  
  var examples = line(function(){/*
    // Импорт функций в глобальный объект для удобной работы:
    // fjs.$import(window, [ 'list.*', 'list.util.*', 'func.*', 'list.std.*' ]);
    
    var m = {};
    fjs.$import(m, 'list.Cons'); // импорт значения
    fjs.$import(m, 'list.Nil:Null'); // импорт значения с указанным именем
    fjs.$import(m, 'list.util.*'); // импорт множества значений
    m.take(1, m.Cons(1, m.Null))
    
    // Конструктор списка: полное имя
    fjs.stdlib.list.Cons(1, fjs.stdlib.list.Nil)
  
    // натуральные числа (nats - бесконечный их список)
    take(10, nats)

    // основные функции для списка можно вызывать как методы, не экспортируя их
    nats.take(10)
    
    // простые числа
    take(10, primes)
    
    // сотое простое число
    nth(99, primes)
    
    // конструктор списка
    Cons(1, Cons(2, Cons(3, Nil)))
    
    // ConsL - конструктор списка с ленивым концом
    ConsL(1, Const(ConsL(2, Const(Cons(3, Nil)))))
    
    // ConsLL - конструктор ленивого списка
    ConsLL(Const(1), Const(ConsLL(Const(2), Const(Cons(3, Nil)))))
    
    // список, полученный из массива (элементы массива скопировались)
    AList([1,2,3])
    
    // список-прокси, возвращающий элементы массива
    List([1,2,3])
    
    // благодаря утиной типизации, List может проксировать и строки
    List('hello')
    
    // голова списка
    head(List([1,2,3]))
    
    // хвост списка
    tail(List([1,2,3]))
    
    // предикаты
    var xs = take(5, nats);
    [ any(function(x){ return x > 3; }, xs),
      all(function(x){ return x > 3; }, xs) ]
    
    // преобразование списка
    map(function(x){ return x+1; }, take(5, nats))
    
    // фильтрация элементов
    filter(function(x){ return x%2; }, take(5, nats))
    
    // свёртка списка
    var xs = take(5, nats);
    [ foldl(function(acc, x){ return acc*x; }, 1, xs),
      sum(xs),
      product(xs) ]
    
    // циклический сдвиг
    shift(take(5, nats))
    
    // сортировка и уникальные элементы
    [ sort(List([3,8,2,1])),
      unique(List([1,2,1,3,2,2])) ]
    
    // сортировка по условию
    sortBy(function(x,y){ return y-x; }, List([3,8,2,1]))
    
    join("", unique(List("Hello world")))
    
    take(1, filter(function(x){ return x < 2; }, nats))
    
    // Привет, динамическая типизация:
    take(5, iterate($(flip(Cons), Nil), Nil))
    
    // разворот списка через foldl
    var reverse = $($(foldl, flip(Cons)), Nil);
    reverse(take(5, nats))
    
    // копирование списка через foldr
    var clone = curry(foldr)(Cons)(Nil);
    clone(take(5, nats))
    
    // все перестановки первых трёх простых чисел
    "\n" + join("\n", permutations(take(3, primes)))
    
    // функция iterate
    var mul2 = function(x){ return 2 * x; };
    take(10, iterate(mul2, 2))
    
    // работа с бесконечным списком единиц
    var ones = ConsL(1, function(){ return ones; });
    take(10, ones)
    
    // небольшой подарок от JavaScript позволяет записать список единиц короче
    // id1 возвращает this. поскольку tail - метод списка, id1 его и возвратит
    take(10, ConsL(1, id1))
    
    // числа Фибоначчи (бесконечный список)
    var plus = function(x,y){ return x+y; },
    fibs = Cons(1, ConsL(1,
      function(){ return zipWith(plus, fibs, tail(fibs)); }));
    take(10, fibs)
    
    // field("x") возвращает поле 'x' аргумента
    map(field("x"), List([{x: 3}, {x: 4, y: 5}]))
    
  */}).split(/(\r\n|\r|\n){2,}/).filter(function(x){
    return !/^\s*$/.test(x);
  });
  
  setText(UI.examples, examples.map(function(t, i){
    var res;
    try {
      res = String(eval(t));
      if(res === void 0) throw new Error('Undefined result.');
      return t + ' ==== ' + res + '\n\n';
    } catch(e) {
      ++ nerrors;
      console.error('ERROR EXAMPLE #' + (i+1), t);
      console.error(e.stack);
      return '';
    }
  }).join(''));
  
  if(typeof testResult !== 'object')
    window.testResult = [1,0];
  
  if(nerrors || testResult[0]) {
    setText(UI.examplesTitle, 'Примеры (' +
      nerrors + '/' + examples.length + ' ошибок в примерах и ' +
      testResult[0] + '/' + testResult[1] + ' в тестах)');
  }
  
  console.log('EXAMPLES:', (examples.length - nerrors), '/', examples.length);

  print = function print(){
    var args = Array.prototype.slice.call(arguments);
    setImmediate(function(){
      UI.yourOutput.value += args.map(safe(String)).join(' ') + '\n';
    });
  };
  
  function runCode(){
    setImmediate(function(){ UI.yourOutput.value = 'Evaluation...'; });
    setImmediate(function(){
      UI.yourOutput.value = '';
      var res;
      try {
        res = eval(UI.yourSrc.value);
      } catch(e) {
        res = 'Error: ' + e.message;
      }
      if(res !== undefined){
        print('------------------------------------------');
        print(res);
      }
    });
  }

  UI.yourSrc.value = line(function(){/*
    // аналогично 'plus = (+)' в Haskell
    var plus = function(x,y){ return x+y; };

    // бесконечный список чисел Фибоначчи
    // аналогично 'fibs = 1 : 1 : zipWith plus fibs (tail fibs)' в Haskell
    var fibs = Cons(1, ConsL(1,
        function(){ return zipWith(plus, fibs, tail(fibs)); }));

    print('ten fibs:', take(10, fibs));

    // Нажмите Ctrl или Cmd для исполнения кода.
  */});

  UI.execYourSrc.onclick = runCode;

  UI.yourSrc.onkeydown = function(e){
    var event = e || window.event;
    
    if(!event.ctrlKey && !event.metaKey){ return; }
    runCode();
  };
  
  UI.cleanYourSrc.onclick = function(){
    UI.yourSrc.value = '';
  };
  
  runCode();
  UI.container.style.display = 'block';
  UI.yourSrc.focus();

})();
