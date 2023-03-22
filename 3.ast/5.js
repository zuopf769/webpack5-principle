const types = require('@babel/types');
const template = require('@babel/template');

const astSource = `
 while(true){
  let a = 1;
  let b = 2;
  let c = 3;
 }
`;

let node = template.statement(`XX`)({
  XX:`
  while(true){
   let a = 1;
   let b = 2;
   let c = 3;
  }
 `
});

