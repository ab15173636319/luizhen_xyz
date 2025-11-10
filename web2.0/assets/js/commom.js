// 取消网页默认操作，如可复制内容，右键菜单等

// 禁用右键菜单
document.addEventListener("contextmenu", function (e) {
  MessageBox.warning("不准右键！");
  e.preventDefault();
});


// 监听按键输入ctrl+u
document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.key === "u") {
    MessageBox.warning("不准看源代码！偷偷告诉你，f12还可以哦！");
    e.preventDefault();
  }
});
