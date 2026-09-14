<template>
  <router-view />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  direction: rtl;
  background: #f8fafc;
  color: #1e293b;
  -webkit-font-smoothing: antialiased;
}

/* Override RTL for English text inputs */
input[dir="ltr"] {
  direction: ltr;
  text-align: left;
}
</style>
