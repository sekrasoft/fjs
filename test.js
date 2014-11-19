var testResult;

(function test(){

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

  var o = Cons(1, Nil);
  var ntests = 0, nerrors = 0;
  line(function(){/*
  
    var _ = {};
    fjs.$import(_);
    String(_.list.Cons(1, _.list.Nil)) === '[1]'
    
    var _ = {};
    fjs.$import(_, '*');
    String(_.list.Cons(1, _.list.Nil)) === '[1]'
  
    var _ = {};
    fjs.$import(_, 'list.Nil:N');
    String(_.N) === '[]'
  
    var _ = {};
    fjs.$import(_, ['list.Nil:N', 'list.util.map']);
    String(_.map(id, _.N)) === '[]'
  
    var _ = {};
    fjs.$import(_, ['list.std.*']);
    _.primes.nth(5) === 13
    
    var _ = {}, x = {list: 5};
    fjs.$import(_, x);
    _.list === 5
    
    var _ = {}, x = {list: 5};
    fjs.$import(_, 'list', x);
    _.list === 5
    
    var _ = {}, x = {list: 5};
    fjs.$import(_, ['list'], x);
    _.list === 5
  
    head(o) === 1
    
    tail(o) === Nil
    
    length(Nil) === 0
    
    length(o) === 1
    
    length(List([1,2,3])) === 3
    
    length(AList([1,2,3])) === 3
    
    String(List([1,2,3,4,5]).toArray()) === '1,2,3,4,5'
    
    String(AList([1,2,3,4,5]).toArray()) === '1,2,3,4,5'
    
    Const(5)(6) === 5
    
    id(3) === 3
    
    id1.bind({x: 4})().x === 4
    
    head(Cons(1, Nil)) === head(ConsL(1, Const(Nil)))
    
    head(Cons(1, Nil)) === head(ConsLL(Const(1), Const(Nil)))
    
    head(tail(Cons(1, Cons(2, Nil)))) === 2
    
    head(tail(ConsLL(Const(1), Const(ConsLL(Const(2), Const(Nil)))))) === 2
    
    head(tail(ConsL(1, Const(ConsL(2, Const(Nil)))))) === 2
    
    $(function(x,y){ return x+y; }, 5)(6) === 11
    
    flip(function(x,y){ return x-y; })(2,3) === 1
    
    compose(function(x){ return x*5; }, function(x){ return x+4; })(2) == 30
    
    field('x')({x:3}) === 3
    
    reverse(Nil) === Nil
    
    String(reverse(AList([1,2,3]))) === '[3,2,1]'
    
    sum(AList([1,2,3])) === 6
    
    sum(Nil) === 0
    
    product(AList([1,2,3])) === 6
    
    product(Nil) === 1
    
    take(0, Nil) === Nil
    
    String(take(1, o)) === '[1]'
    
    String(take(2, o)) === '[1]'
    
    String(map(function(x){ return x*x; }, AList([1,2,3]))) === '[1,4,9]'
    
    map(function(){}, Nil) === Nil
    
    String(filter(function(x){ return !(x%3); }, AList([1,2,3,4,5,6]))) === '[3,6]'
    
    filter(function(){}, Nil) === Nil
    
    foldl(function(acc, x){ return acc+x; }, 0, AList([1,2,3])) === 6
    
    foldr(function(x, acc){ return x-acc; }, 0, AList([1,2,3])) === 2
    
    foldl(function(){}, 5, Nil) === 5
    
    foldr(function(){}, 5, Nil) === 5
    
    any(function(x){ return x > 2; }, AList([1,2,3])) === true
    
    all(function(x){ return x > 2; }, AList([1,2,3])) === false
    
    any(function(x){ return x > 2; }, AList([1,2,0])) === false
    
    all(function(x){ return x > 2; }, AList([4,5,3])) === true
    
    any(function(x){}, Nil) === false
    
    all(function(x){}, Nil) === true
    
    nth(0, AList([1,2,3])) === 1
    
    nth(2, AList([1,2,3])) === 3
    
    String(concat1(AList([1,2]), AList([3,4]))) === '[1,2,3,4]'
    
    String(concat(AList([Nil, AList([1,2]), Nil, Nil, AList([3,4]), Nil]))) === '[1,2,3,4]'
    
    String(concat(AList([Nil,o,o,Nil,o,o,o]))) === '[1,1,1,1,1]'
    
    concat(AList([Nil,Nil,Nil,Nil,Nil])) === Nil
    
    String(take(3, iterate(function(x){ return x*2; }, 1))) === '[1,2,4]'
    
    String(shift(AList([1,2,3]))) === '[2,3,1]'
    
    shift(Nil) === Nil
    
    String(permutations(Nil)) === '[]'
    
    String(permutations(Cons(1, Nil))) === '[[1]]'
    
    String(permutations(AList([1,2]))) === '[[1,2],[2,1]]'
    
    String(zipWith(function(x,y){ return x+y; }, AList([1,2]), AList([10,20,30,40]))) === '[11,22]'
    
    sort(Nil) === Nil
    
    sortBy(function(){}, Nil) === Nil
    
    String(sort(AList([3,2,1]))) === '[1,2,3]'
    
    String(sortBy(function(x,y){ return y-x; }, AList([1,2,3]))) === '[3,2,1]'
    
    unique(Nil) === Nil
    
    String(unique(AList([1,1,1,1,1,1]))) === '[1]'
    
    sum(unique(AList([1,10,100,1,10,100,1,1,1]))) === 111
    
    join('-', Nil) === ''
    
    join('-', Cons(1,Nil)) === '1'
    
    join('-', AList([1,2,3])) === '1-2-3'
    
    String(take(6, nats)) === '[1,2,3,4,5,6]'
    
    String(take(6, squares)) === '[1,4,9,16,25,36]'
    
    String(take(6, primes)) === '[2,3,5,7,11,13]'
    
    '[1]' === String(take(1, filter(function(x){ return x<2; }, nats)))
    
    '[1,1,2,1,2,3,1,2,3,4]' === String(take(10, concat( map($(flip(take), nats), nats) )))
    
  */}).split(/(\r\n|\r|\n){2,}/).filter(function(x){
    return !/^\s*$/.test(x);
  }).forEach(function(code, i){
    try {
      ++ ntests;
      // console.log('TEST: #' + (i+1), code);
      var x = eval(code);
      if(x !== true){
        ++ nerrors;
        console.error('ERROR: FAILED #' + (i+1), code);
      }
    } catch(e){
      ++ nerrors;
      console.error('ERROR: EXCEPTION #' + (i+1), code);
      console.error(e.stack);
    }
  });
  
  testResult = [nerrors, ntests];

  console.log('TESTS:', (ntests - nerrors), '/', ntests);
})();