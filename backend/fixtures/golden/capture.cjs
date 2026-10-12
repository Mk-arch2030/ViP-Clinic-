'use strict';
// Review-only extraction: never executes the store, imports browser storage or rewrites baseline.
const ts=require('typescript');
function literals(source){
 const file=ts.createSourceFile('clinicStore.ts',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
 const values={};
 function read(node){
  if(ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node))return node.text;
  if(ts.isNumericLiteral(node))return Number(node.text);
  if(node.kind===ts.SyntaxKind.TrueKeyword)return true;
  if(node.kind===ts.SyntaxKind.FalseKeyword)return false;
  if(node.kind===ts.SyntaxKind.NullKeyword)return null;
  if(ts.isIdentifier(node)&&Object.hasOwn(values,node.text))return structuredClone(values[node.text]);
  if(ts.isPropertyAccessExpression(node)&&ts.isIdentifier(node.expression)&&Object.hasOwn(values,node.expression.text)&&Object.hasOwn(values[node.expression.text],node.name.text))return structuredClone(values[node.expression.text][node.name.text]);
  if(ts.isArrayLiteralExpression(node))return node.elements.map(read);
  if(ts.isObjectLiteralExpression(node)){const out={};for(const p of node.properties){if(!ts.isPropertyAssignment(p))throw Error('Nonliteral property rejected');const key=p.name.text;if(typeof key!=='string'||Object.hasOwn(out,key))throw Error('Invalid property');out[key]=read(p.initializer);}return out;}
  throw Error('Generated or unknown source expression rejected');
 }
 for(const statement of file.statements)if(ts.isVariableStatement(statement))for(const declaration of statement.declarationList.declarations){
  if(ts.isIdentifier(declaration.name)&&/^INITIAL_/.test(declaration.name.text))values[declaration.name.text]=read(declaration.initializer);
 }
 for(const key of ['INITIAL_PATIENTS','INITIAL_CASES','INITIAL_VISITS','INITIAL_CLINIC_DAY'])if(!Object.hasOwn(values,key))throw Error('Missing historical seed '+key);
 let state;
 function visit(node){if(ts.isMethodDeclaration(node)&&node.name.getText(file)==='loadState')for(const statement of node.body.statements)if(ts.isReturnStatement(statement)&&ts.isObjectLiteralExpression(statement.expression))state=read(statement.expression);ts.forEachChild(node,visit);}
 visit(file);if(!state)throw Error('Literal initial state not found');return state;
}
function canonical(value){if(Array.isArray(value))return value.map(canonical);if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical(value[k])]));return value;}
const serialize=value=>JSON.stringify(canonical(value),null,2)+'\n';
module.exports={literals,canonical,serialize};
