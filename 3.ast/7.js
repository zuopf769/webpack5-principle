function a() {
  b()
}
function b() {
  c();
}
function c() {
  debugger
  console.log(c);
}
a();