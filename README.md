## TODO

现在的`commitAllWork`函数只处理普通节点, 不处理函数和 class component.

另外现在的 update 操作有可能会直接替换原有节点, 如果被替换的节点的子节点是 update, 就有可能出现更新到旧 DOM 上, 从而更新失败的情况.

- [ ] 实现删除操作
- [ ] 实现 class component 状态更新重新渲染
- [ ] 实现 function component 的更新
- [ ] 重新考虑 update 状态及其 DOM 更新策略
