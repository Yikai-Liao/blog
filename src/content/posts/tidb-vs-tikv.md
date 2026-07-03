---
title: TiDB vs TiKV 区别
published: 2026-07-04
description: TiDB 和 TiKV 的系统边界、抽象层级和职责差异。
tags: [Database]
category: Chats
author: GPT-5.5
draft: false
---

## 第 1 轮：TiDB 和 TiKV 的区别

:::note[提问]
tikv 和 tidb 区别是啥
:::

我先按“系统边界”拆：TiDB 是面向用户的分布式 SQL 数据库；TiKV 是它下面的分布式事务 KV 存储层。关键差异不在语言或部署包，而在抽象层级、数据模型和承担的职责。

### 一句话

**TiDB 是数据库；TiKV 是 TiDB 底下的分布式事务 KV 存储引擎。**

更准确一点：

- **TiDB**：MySQL 协议兼容的分布式 SQL 数据库系统
- **TiKV**：支持事务、Raft 复制、Region 分片的分布式 Key-Value 存储层

TiDB 的官方架构里，**TiDB Server 是无状态 SQL 层**，负责接收 MySQL 协议请求、解析 SQL、优化查询、生成分布式执行计划；它自己不存数据，实际读写会发给 TiKV 或 TiFlash。([docs.pingcap.com](https://docs.pingcap.com/tidb/stable/tidb-architecture/))\
TiKV 则负责真正存储数据，是一个分布式事务 KV 数据库，提供 ACID 事务 API，并通过 Raft 保证多副本一致性和高可用。([docs.pingcap.com](https://docs.pingcap.com/tidb/stable/tikv-overview))

---

### 核心区别

| 维度      | TiDB                    | TiKV                                          |
| ------- | ----------------------- | --------------------------------------------- |
| 抽象层级    | 数据库系统 / SQL 层           | 分布式事务 KV 存储层                                  |
| 面向谁     | 应用开发者、DBA               | 数据库内核、存储系统、基础设施开发者                            |
| 接口      | MySQL 协议、SQL            | Key-Value API / gRPC / RawKV / TxnKV          |
| 数据模型    | 表、行、索引、SQL 查询           | 有序 Key Range、Region、KV Pair                   |
| 是否自己存数据 | **狭义 TiDB Server 不存数据** | **存数据**                                       |
| 核心职责    | SQL 解析、优化、执行计划、事务协调     | 持久化、分片、复制、Raft、一致性、事务存储                       |
| 类比      | PostgreSQL/MySQL 这一层    | FoundationDB / Bigtable / Spanner Storage 这一层 |
| 典型使用    | 替代 MySQL，做分布式 OLTP/HTAP | 做自定义分布式 KV、元数据存储、数据库底座                        |

---

### 实际数据链路

一次 SQL 大概是这样走的：

```text title="SQL 到 KV 的读写链路"
应用
  ↓ MySQL 协议
TiDB Server
  ↓ SQL 解析 / 优化 / 执行计划
把表、行、索引编码成 KV 操作
  ↓
TiKV
  ↓ Region 分片 / Raft 多副本 / RocksDB 落盘
磁盘
```

所以，TiDB 不是“直接把表存在自己里面”。它会把 SQL 世界里的东西：

```sql title="业务 SQL 写入"
INSERT INTO user(id, name) VALUES (1, 'kai');
```

转换成底层 KV 写入，例如概念上类似：

```text title="概念上的 KV 编码"
table:user:row:1 -> {name: "kai"}
index:user:name:kai -> row_id:1
```

真正落盘的是 TiKV。

---

### 一个容易混淆的点：TiDB 这个词有两层含义

#### 1. 狭义 TiDB

指 **TiDB Server**，也就是 SQL 计算层。它是无状态的，不存持久化数据。([docs.pingcap.com](https://docs.pingcap.com/tidb/stable/tidb-architecture/))

#### 2. 广义 TiDB

指完整 TiDB 集群，通常包括：

```text title="TiDB 集群组件"
TiDB Server  SQL 层
PD           元数据 / 调度 / 时间戳
TiKV         行存储 / OLTP 存储
TiFlash      列存储 / 分析加速，可选
```

TiDB 官方架构里，PD 负责集群元数据、调度和事务 ID 分配；TiKV 负责存储；TiFlash 是列式存储，主要用于分析查询。([docs.pingcap.com](https://docs.pingcap.com/tidb/stable/tidb-architecture/))

所以有人说“TiDB 存数据”，这是在说**广义 TiDB 系统**；有人说“TiDB 不存数据”，这是在说**狭义 TiDB Server**。两者都可能对，但语境不同。

---

### TiKV 自己能不能单独用？

能。TiKV 不是 TiDB 的私有组件，它本身就是一个分布式 KV 数据库。官方介绍里也说 TiKV 提供 raw 和事务型 KV API，可用于在线服务、对象存储元数据、推荐系统存储、在线特征库等场景。([tikv.org](https://tikv.org/))

但问题是：

:::warning[直接使用 TiKV 的代价]
**TiKV 单独用，你拿到的是 KV，不是 SQL。**
:::

你需要自己解决：

- schema 怎么设计；
- key 怎么编码；
- 索引怎么维护；
- 二级索引一致性；
- 查询能力；
- 数据迁移；
- 运维工具；
- 事务边界；
- 热点 key / 热点 Region；
- 应用层抽象。

TiDB 已经把这些东西在 SQL 层替你做了一大部分。

---

### 从第一性原理看

数据库系统至少有几层：

```text title="数据库系统分层"
查询语言层：SQL / 查询优化 / Join / 聚合 / 索引选择
事务层：ACID / 隔离级别 / 并发控制
分布式层：分片 / 调度 / 副本 / 故障恢复
存储层：KV / LSM / WAL / Compaction / 落盘
```

TiDB 偏上层：

```text title="TiDB 的位置"
SQL + 查询优化 + 分布式执行 + SQL 事务语义
```

TiKV 偏下层：

```text title="TiKV 的位置"
分布式事务 KV + Raft 复制 + Region 分片 + RocksDB 落盘
```

TiKV 的架构里，数据按 Region 切分，每个 Region 通常有多个 Peer，组成 Raft group；Leader 负责读写，写入多数副本后才成功。([docs.pingcap.com](https://docs.pingcap.com/tidb/stable/tikv-overview)) TiKV 还用 MVCC，并在 Raft 层之上构建分布式事务层。([tikv.github.io](https://tikv.github.io/tikv-dev-guide/understanding-tikv/intro.html))

---

### 什么时候用哪个？

#### 用 TiDB

你想要的是：

- MySQL 兼容；
- SQL；
- 表、索引、事务；
- 横向扩展；
- 比 MySQL 分库分表更透明；
- 应用少改代码；
- OLTP 为主，兼顾一部分分析。

简单说：

:::tip[选择 TiDB]
**你要的是数据库，就用 TiDB。**
:::

---

#### 用 TiKV

你想要的是：

- 自己构建存储系统；
- 你的数据天然就是 KV；
- 你愿意自己设计 key encoding；
- 需要分布式事务 KV；
- 不想要 SQL 层；
- 要做元数据系统、调度系统、特征存储、自定义数据库内核。

简单说：

:::important[选择 TiKV]
**你要的是一个强一致、可扩展的分布式 KV 底座，才直接用 TiKV。**
:::

---

### 类比

可以粗暴类比成：

```text title="粗略类比"
TiDB  ≈  MySQL-compatible distributed SQL database
TiKV  ≈  distributed transactional RocksDB + Raft + MVCC + sharding
PD    ≈  cluster brain / metadata / scheduling / timestamp oracle
```

但要注意，TiKV 不是嵌入式 RocksDB。它是一个完整的分布式服务，里面用 RocksDB 做本地存储，并在上面加了 Region、Raft、MVCC、事务、调度等机制。([docs.pingcap.com](https://docs.pingcap.com/tidb/stable/tikv-overview))

---

### 最终判断

**TiDB 和 TiKV 不是同类产品。**

更像是：

```text title="最终关系"
TiDB 依赖 TiKV
TiKV 支撑 TiDB
TiDB 给你 SQL 数据库体验
TiKV 给你分布式事务 KV 能力
```

如果你的问题是“我做业务系统该选哪个”，大多数情况下答案是 **TiDB**。\
如果你的问题是“我想给自己的 runtime / agent 系统找一个强一致分布式状态底座”，才有必要单独评估 **TiKV**。

## 第 2 轮：工作流状态更适合谁

:::note[提问]
对于保存工作流状态谁更合适
:::

### 结论

:::tip[结论]
**保存工作流状态：优先 TiDB，不要直接用 TiKV。**
:::

更准确地说：

```text title="工作流状态存储选择"
业务工作流状态 / Agent 状态 / 任务调度状态
→ TiDB 更合适

你在自己造一个数据库内核、状态机存储层、超高吞吐 KV runtime
→ 才考虑直接用 TiKV
```

TiDB 本身就是 SQL 层，底下用 TiKV 存数据；TiDB Server 是无状态 SQL 层，TiKV 是分布式事务 KV 存储层。([PingCAP Docs](https://docs.pingcap.com/tidb/stable/tidb-architecture/?utm_source=chatgpt.com), [PingCAP Docs](https://docs.pingcap.com/tidb/stable/tikv-overview?utm_source=chatgpt.com))\
所以用 TiDB，不是放弃 TiKV，而是**通过 SQL 抽象使用 TiKV**。

---

### 为什么工作流状态更适合 TiDB

工作流状态不是单纯的：

```text title="最简单但不够用的 KV 模型"
workflow_id -> state_json
```

实际会变成一组互相关联的状态：

```text title="真实工作流状态通常包含这些实体"
workflow_instance
workflow_step
workflow_event
workflow_task_queue
workflow_timer
workflow_retry
workflow_lock / lease
workflow_outbox
workflow_signal
workflow_artifact
```

你通常需要做这些查询：

```sql title="工作流状态查询示例"
-- 找出待执行任务
SELECT *
FROM workflow_tasks
WHERE status = 'pending'
  AND scheduled_at <= NOW()
ORDER BY priority, scheduled_at
LIMIT 100;

-- 找出卡住的 workflow
SELECT *
FROM workflow_instances
WHERE status = 'running'
  AND updated_at < NOW() - INTERVAL 10 MINUTE;

-- 查某个 workflow 的完整执行历史
SELECT *
FROM workflow_events
WHERE workflow_id = ?
ORDER BY event_index;
```

这些天然是 **SQL + 索引 + 事务 + 可观测查询** 的场景。

TiDB 支持乐观事务和悲观事务，适合做状态转移、任务抢占、幂等写入这类并发控制。([PingCAP Docs](https://docs.pingcap.com/tidb/stable/transaction-overview/?utm_source=chatgpt.com), [PingCAP Docs](https://docs.pingcap.com/tidb/stable/pessimistic-transaction?utm_source=chatgpt.com))\
它也有行级 TTL，可以用来清理中间状态、过期任务、历史数据。([PingCAP Docs](https://docs.pingcap.com/tidb/stable/time-to-live/?utm_source=chatgpt.com))

---

### 工作流状态的核心不是“存下来”，而是“状态转移正确”

比如一个 step 执行完成时，往往需要原子完成：

```text title="一次 step 完成后的原子动作"
1. 把 step A 标记为 completed
2. 写入 step A 的输出 artifact
3. 追加 workflow event
4. 判断后继 step 是否满足依赖
5. 创建 step B / step C 的 pending task
6. 更新 workflow_instance 的整体状态
```

这不是一个简单 KV 写入。它需要事务。

在 TiDB 里，这可以自然写成：

```sql title="TiDB 中的一次状态转移事务"
BEGIN;

UPDATE workflow_steps
SET status = 'completed',
    finished_at = NOW()
WHERE workflow_id = ?
  AND step_id = ?
  AND status = 'running';

INSERT INTO workflow_events (...);

INSERT INTO workflow_tasks (...)
SELECT ...
WHERE ...;

UPDATE workflow_instances
SET updated_at = NOW()
WHERE workflow_id = ?;

COMMIT;
```

如果直接用 TiKV，你也可以用事务 KV API 做，但你要自己设计：

```text title="直接使用 TiKV 需要自建的能力"
key encoding
二级索引
状态扫描
任务队列排序
租约抢占
历史事件排序
schema migration
debug 工具
数据修复工具
后台清理
热点 key 规避
```

这相当于自己在 TiKV 上再造一个弱化版 TiDB / FoundationDB layer。

---

### TiKV 的问题：它太底层

TiKV 提供 RawKV 和事务型 KV API。官方也明确说它是分布式、事务型 KV 数据库，提供 ACID 事务 API。([TiKV](https://tikv.org/?utm_source=chatgpt.com), [TiKV](https://tikv.org/docs/5.1/develop/rawkv/introduction/?utm_source=chatgpt.com))

问题是：**KV 能力不是 workflow engine 真正缺的那一层。**

你保存 workflow 状态时，真正麻烦的是：

| 问题        |            TiDB |        直接 TiKV |
| --------- | --------------: | -------------: |
| 按状态查询任务   |          简单，建索引 |     需要自建索引 key |
| 查执行历史     |       简单，SQL 排序 | 需要设计 event key |
| 找超时任务     |         简单，时间索引 |     需要时间维度 key |
| 人工排查      |         SQL 直接查 |          需要写工具 |
| schema 演进 | DDL / migration |       自己设计版本兼容 |
| 数据修复      | UPDATE / DELETE |          手写批处理 |
| 报表统计      |          SQL 聚合 |        自己扫 key |
| 多表状态转移    |          SQL 事务 | KV 事务 + 自己维护约束 |
| 运维人员理解    |               高 |              低 |

直接用 TiKV 最大的问题不是“做不到”，而是**你把数据库层该解决的问题重新搬回应用层了**。

---

### 推荐模型

我会把 workflow 状态拆成三类表。

#### 1. 当前状态表

用于快速判断 workflow 当前在哪里。

```text
workflow_instances
workflow_steps
workflow_tasks
```

特征：

```text
强一致
频繁更新
需要索引
需要状态机约束
```

放 TiDB。

---

#### 2. 事件历史表

用于审计、回放、debug。

```text
workflow_events
```

最好是 append-only：

```text
workflow_id
event_index
event_type
payload_json
created_at
```

放 TiDB。

如果量很大，历史事件可以后续归档到对象存储或日志系统，但主索引仍可在 TiDB 保留。

---

#### 3. 临时状态 / 租约 / 定时器

例如：

```text
worker lease
retry timer
idempotency key
dedupe key
pending signal
```

也可以先放 TiDB。

因为这些东西经常需要：

```text
按时间扫描
按状态扫描
CAS 更新
过期清理
```

TiDB 的 SQL + 事务 + TTL 已经够用。

---

### 什么时候 TiKV 反而更合适？

只有在这些条件同时成立时，才值得直接 TiKV：

1. **状态模型极其简单**：基本就是 `key -> value`。
2. **查询模式完全固定**：没有 ad-hoc 查询，没有复杂筛选。
3. **你愿意自建索引**：比如 `status/pending/time/workflow_id` 都自己编码进 key。
4. **你有存储系统工程能力**：能处理 key schema、热点、迁移、修复、debug。
5. **SQL 层成为明确瓶颈**：不是想象瓶颈，而是压测证明 TiDB Server / SQL optimizer / SQL protocol 成本不可接受。

典型例子：

```text
你在实现一个 Temporal/Cadence 风格的底层 persistence backend，
并且想要极致控制 key layout。
```

否则不值得。

---

### 更现实的建议

如果只是公司内部 workflow / agent runtime / job orchestration：

```text
第一选择：PostgreSQL / TiDB
第二选择：TiDB + Redis 辅助队列
第三选择：专门 MQ + TiDB 状态库
不建议：直接 TiKV
```

如果你已经在阿里云上有 PostgreSQL，我甚至会说：

```text
小中规模：PostgreSQL 更简单
需要水平扩展 / MySQL 兼容 / 大量状态数据：TiDB
极少数自研存储内核场景：TiKV
```

---

### 我的判断

对于“保存工作流状态”，**TiDB 更合适**。

原因不是 TiDB 更高级，而是 workflow 状态的本质是：

```text
有结构的数据
有状态机约束
有多实体事务
有复杂查询
有人工排障需求
有历史审计需求
```

这正是 SQL 数据库的适用区间。

直接 TiKV 的收益主要是：

```text
更底层
更可控
潜在更高性能
```

但代价是：

```text
你要自己实现一套状态数据库抽象
```

所以除非你明确是在做 **workflow storage engine**，否则不要直接碰 TiKV。

## 第 3 轮：TiDB 的 MySQL 兼容性边界

:::note[提问]
tidb 基于 MySQL 做兼容性会不会有些问题
:::

### 会有问题

:::warning[兼容性边界]
**TiDB 不是“分布式 MySQL”。它是“高度兼容 MySQL 协议和常用语法的分布式 SQL 数据库”。**
:::

官方说法也是：TiDB 高度兼容 MySQL 5.7 / 8.0 的协议、常用功能和语法，但并不支持所有 MySQL 特性，而且部分差异来自分布式系统实现难度。([PingCAP Docs](https://docs.pingcap.com/tidb/stable/mysql-compatibility), [PingCAP Docs](https://docs.pingcap.com/tidb/stable/mysql-compatibility))

所以问题不是“能不能用 MySQL driver / ORM”，大多数能用；问题是**你能不能接受它和 InnoDB 语义不完全一致**。

---

### 对 workflow 状态存储，最需要注意的点

#### 1. `SKIP LOCKED` 不支持

这点很关键。

很多数据库任务队列会写成：

```sql title="不能照搬的队列写法"
SELECT *
FROM workflow_tasks
WHERE status = 'pending'
ORDER BY scheduled_at
LIMIT 100
FOR UPDATE SKIP LOCKED;
```

TiDB 的 MySQL 兼容性文档明确列出 `SKIP LOCKED` 语法不支持。([PingCAP Docs](https://docs.pingcap.com/tidb/stable/mysql-compatibility))

所以如果你的 workflow engine 想用数据库表直接做 queue，不能照搬 PostgreSQL / MySQL 8 里常见的 `FOR UPDATE SKIP LOCKED` 模式。

更适合 TiDB 的方式是**租约抢占**：

```sql title="更适合 TiDB 的租约抢占"
UPDATE workflow_tasks
SET
  status = 'leased',
  lease_owner = ?,
  lease_until = NOW() + INTERVAL 30 SECOND,
  attempt = attempt + 1
WHERE status = 'pending'
  AND scheduled_at <= NOW()
ORDER BY priority DESC, scheduled_at ASC
LIMIT 100;
```

然后再查自己抢到的任务：

```sql title="查询自己抢到的任务"
SELECT *
FROM workflow_tasks
WHERE status = 'leased'
  AND lease_owner = ?;
```

这比依赖行锁队列更稳定，也更适合分布式 workflow runtime。

---

#### 2. 锁语义不是完整 InnoDB

TiDB 支持悲观事务，但官方也说明它和 MySQL InnoDB 有差异。一个典型差异是：TiDB 当前不支持 gap lock，所以范围条件下的 `SELECT ... FOR UPDATE` 不会像 InnoDB 那样阻塞范围内的新插入。([PingCAP Docs](https://docs.pingcap.com/tidb/stable/pessimistic-transaction/))

这对 workflow 状态库意味着：

```sql title="范围锁示例"
SELECT *
FROM workflow_tasks
WHERE scheduled_at BETWEEN ? AND ?
FOR UPDATE;
```

不要以为这能锁住这个时间范围，防止别人插入新的任务。TiDB 不是这么工作的。

所以设计状态机时应该依赖：

```text
唯一约束
CAS 条件更新
幂等 key
lease_until
version / revision
event_index
```

而不是依赖 InnoDB 风格的范围锁。

---

#### 3. 隔离级别名字兼容，但语义不完全等价

TiDB 的 `transaction_isolation` 默认显示为 `REPEATABLE-READ`，但官方文档说明，TiDB 为兼容 MySQL 暴露这个名字，实际隔离级别是 Snapshot Isolation。([PingCAP Docs](https://docs.pingcap.com/tidb/stable/system-variables))

这不是说它不一致或不可靠，而是说：

```text
不要把 TiDB 当成 InnoDB 的行为克隆。
```

workflow 场景里，你应该显式处理并发冲突，例如：

```sql title="显式 CAS 状态更新"
UPDATE workflow_steps
SET status = 'completed',
    version = version + 1
WHERE workflow_id = ?
  AND step_id = ?
  AND status = 'running'
  AND version = ?;
```

然后检查 affected rows。

这比假设隔离级别替你解决状态机并发更可靠。

---

#### 4. 不支持 trigger / stored procedure / event

TiDB 不支持 MySQL 的存储过程、函数、触发器、事件、用户自定义函数等特性。([PingCAP Docs](https://docs.pingcap.com/tidb/stable/mysql-compatibility))

如果你的 workflow 状态逻辑想放在数据库里，比如：

```text
任务完成后 trigger 自动创建下游任务
定时 event 自动扫描超时任务
stored procedure 封装状态转移
```

那 TiDB 不适合这种写法。

但我反而认为 workflow runtime 不应该把状态机核心逻辑塞进 trigger / procedure 里。更好的设计是：

```text
应用层显式状态转移
数据库只做约束、事务、索引、持久化
```

这对 TiDB、PostgreSQL、MySQL 都更清晰。

---

#### 5. 自增 ID 不应承担顺序语义

TiDB 的 `AUTO_INCREMENT` 值全局唯一，但不保证严格连续；官方也建议避免混合默认值和自定义值，否则可能遇到重复错误。([PingCAP Docs](https://docs.pingcap.com/tidb/stable/mysql-compatibility))

workflow 里不要用：

```text
auto_increment id 越大 = 事件越晚
```

更稳的是：

```text
workflow_id + event_index
created_at
commit_ts
snowflake / uuidv7
```

事件流表最好设计成：

```sql title="事件流表设计"
CREATE TABLE workflow_events (
  workflow_id VARCHAR(64) NOT NULL,
  event_index BIGINT NOT NULL,
  event_type VARCHAR(64) NOT NULL,
  payload JSON NOT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (workflow_id, event_index)
);
```

每个 workflow 内部自己维护 `event_index`，不要把数据库全局自增 ID 当业务时序。

---

### 对你的场景，风险分层

| 场景                             |                                                                                                                         TiDB 兼容性风险 |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------: |
| 普通 CRUD                        |                                                                                                                                  低 |
| ORM 基础使用                       |                                                                                                                                低到中 |
| JSON 字段 + 索引 + 状态机表            |                                                                                                                                低到中 |
| 数据库表做任务队列                      |                                                                                                                                  中 |
| 依赖 `SKIP LOCKED`               |                                                                                                                                  高 |
| 依赖 trigger / procedure / event |                                                                                                                                  高 |
| 依赖 InnoDB gap lock             |                                                                                                                                  高 |
| 依赖 MySQL 主从复制协议                | 高，TiDB 不支持 MySQL replication protocol，需要 DM / TiCDC 等工具 ([PingCAP Docs](https://docs.pingcap.com/tidb/stable/mysql-compatibility)) |
| 复杂 DDL、分区、特殊索引                 |                      中到高，TiDB 文档列了 DDL、索引、分区、视图、类型系统等差异 ([PingCAP Docs](https://docs.pingcap.com/tidb/stable/mysql-compatibility)) |

---

### 我的判断

如果只是保存 workflow 状态，我会这么判断：

```text title="TiDB 使用判断"
TiDB 可以用
但不要按“传统 MySQL + InnoDB 队列”的套路用
```

更具体：

#### 可以用 TiDB 的部分

```text
workflow_instances
workflow_steps
workflow_tasks
workflow_events
workflow_artifacts
workflow_signals
idempotency_keys
```

这些表适合 SQL、索引、事务和人工排障。

#### 不建议依赖的东西

```text
trigger
stored procedure
event scheduler
SKIP LOCKED
gap lock
auto_increment 顺序
InnoDB 特定锁行为
```

#### 推荐的状态转移模型

```text
1. 所有状态转移显式写在应用层
2. 每次转移使用事务
3. 用 version / status 条件做 CAS
4. 用唯一约束保证幂等
5. 用 lease_until 做任务抢占
6. 用 append-only event log 做审计和恢复
7. 用定期 scanner 恢复超时任务
```

---

### 更直接的结论

:::important[更直接的结论]
**TiDB 的 MySQL 兼容性足够支撑 workflow 状态库，但不足以让你无脑照搬 MySQL/InnoDB workflow queue 设计。**
:::

如果你的 workflow runtime 是新设计，我会选：

```text
TiDB / PostgreSQL 风格的显式状态机
而不是 MySQL/InnoDB 风格的锁驱动任务队列
```

也就是说，TiDB 的问题不是“兼容性不够所以不能用”，而是你要避免把它当成一个行为完全一致的 MySQL。

## 第 4 轮：为什么不是 PostgreSQL 兼容

:::note[提问]
我指的是为啥不是兼容 pg 语法
:::

你问的是**产品路线为什么选 MySQL dialect，而不是 PostgreSQL dialect**。这个不是 TiKV/TiDB 架构上必然的结果，而是 TiDB 当年选的**兼容性入口**。

### 先说结论

:::tip[结论]
**TiDB 兼容 MySQL，不是因为分布式 SQL 天然应该兼容 MySQL，而是因为它的目标市场主要是“替换/升级 MySQL 分库分表、Vitess、Aurora MySQL、单机 MySQL”的场景。**
:::

如果它一开始面向的是 PostgreSQL 用户，那完全可以做成 PG-compatible。CockroachDB、YugabyteDB、Citus 就是这条路线。CockroachDB 官方说自己支持 PostgreSQL wire protocol 和多数 PostgreSQL 语法；YugabyteDB 的 YSQL API 则复用了 PostgreSQL query layer；Citus 更直接，是 PostgreSQL extension。([cockroachlabs.com](https://www.cockroachlabs.com/docs/stable/postgresql-compatibility?utm_source=chatgpt.com), [YugabyteDB Docs](https://docs.yugabyte.com/stable/faq/compatibility/?utm_source=chatgpt.com), [GitHub](https://github.com/citusdata/citus?utm_source=chatgpt.com))

---

### 关键点：兼容不是“语法”这么简单

数据库兼容至少有四层：

```text title="数据库兼容的四层"
1. 网络协议：MySQL protocol / PostgreSQL pgwire
2. SQL 语法：LIMIT、UPSERT、DDL、函数调用方式
3. 类型系统：JSON、JSONB、ARRAY、ENUM、TIMESTAMP、collation
4. 运行语义：事务隔离、锁、DDL、catalog、权限、函数、trigger、procedure
```

所以“为啥不兼容 PG 语法”这个说法其实低估了问题。

真正的问题是：

> **TiDB 为什么不选择 PostgreSQL 生态作为兼容目标？**

因为一旦选 PG，就不只是 parser 改一下，而是要兼容：

```text title="选择 PG 兼容要覆盖的表面"
pgwire
pg_catalog
information_schema 的 PG 行为
PostgreSQL type system
JSONB / ARRAY / operator / function semantics
sequence
extension 机制
trigger / stored procedure
transaction and lock behavior
大量 PG ORM 的 introspection 习惯
```

这是一整套产品表面，而不是语法糖。

---

### 为什么 TiDB 选 MySQL

#### 1. 它要吃的是 MySQL 横向扩展市场

TiDB 官方文档明确说它高度兼容 MySQL 5.7 / 8.0 的协议、常用功能和语法，并且 MySQL 生态工具如 MySQL client、Navicat、DBeaver、MySQL Workbench 等可以用于 TiDB。([PingCAP Docs](https://docs.pingcap.com/tidb/stable/mysql-compatibility/?utm_source=chatgpt.com))

这说明它的产品入口很清楚：

```text title="TiDB 面向的迁移入口"
已有 MySQL 应用
已有 MySQL driver
已有 MySQL ORM
已有 MySQL 运维工具
已有分库分表痛点
→ 换成 TiDB，尽量少改业务代码
```

这跟 PostgreSQL 用户的迁移路径不同。PostgreSQL 用户如果要分布式 SQL，更自然会看 CockroachDB、YugabyteDB、Citus，而不是 TiDB。CockroachDB 官方也明确说它支持 PostgreSQL wire protocol，多数 PostgreSQL syntax 和 features，并能使用多数 PostgreSQL client libraries。([cockroachlabs.com](https://www.cockroachlabs.com/docs/stable/postgresql-compatibility?utm_source=chatgpt.com), [cockroachlabs.com](https://www.cockroachlabs.com/docs/stable/developer-basics?utm_source=chatgpt.com))

---

#### 2. TiDB 的商业叙事就是“scale-out MySQL”

TiDB 官方迁移文档里有从 MySQL、MariaDB、Vitess、Aurora 等迁移到 TiDB 的路径；Vitess 到 TiDB 的文档也明确说，因为 Vitess backend 基于 MySQL，所以迁移到 TiDB 可以复用 MySQL 迁移工具，如 Dumpling、TiDB Lightning、TiDB Data Migration。([PingCAP Docs](https://docs.pingcap.com/tidb/stable/migrate-from-vitess/?utm_source=chatgpt.com))

这意味着 TiDB 的核心目标不是：

```text title="不是这个目标"
做一个更好的 PostgreSQL
```

而是：

```text title="真正的产品目标"
给 MySQL 用户一个不用自己分库分表的分布式 SQL
```

这就是它选 MySQL 兼容的根本原因。

---

#### 3. 同时兼容 MySQL 和 PG，成本很高

TiDB 到现在也不是 100% MySQL 兼容。官方文档列了很多 MySQL 差异，并说明有些功能不支持，是因为需求、实现成本，或者分布式系统里实现困难；例如 stored procedures、functions、某些复制协议、部分 SQL 行为都有差异。([PingCAP Docs](https://docs.pingcap.com/tidb/stable/mysql-compatibility/?utm_source=chatgpt.com))

如果 MySQL 兼容都已经有这么多边界，再加 PostgreSQL 兼容，会变成：

```text title="同时兼容 MySQL 和 PG 的成本"
两套协议
两套语法
两套类型系统
两套 catalog
两套错误码
两套 ORM 兼容性测试
两套迁移工具链
两套用户预期
```

这会把工程资源撕裂。

尤其是 PostgreSQL 的“兼容”很难只停在语法层。YugabyteDB 之所以 PG 兼容度高，一个重要原因是它复用了 PostgreSQL query layer；它的官方文档说 YSQL API 复用 PostgreSQL query layer，因此可以支持大量 PostgreSQL 特性，包括 data types、queries、expressions、operators、functions、stored procedures、triggers、extensions 等。([YugabyteDB Docs](https://docs.yugabyte.com/stable/explore/ysql-language-features/?utm_source=chatgpt.com))

TiDB 不是这个路线。它是自己实现 SQL 层，然后底下接 TiKV。

---

### 其实这个选择有明显代价

你这个问题背后隐含的判断是对的：**如果从工作流状态库、任务队列、状态机、JSON 状态、复杂约束出发，PostgreSQL dialect 往往更舒服。**

比如 workflow runtime 常用这些东西：

```text title="Workflow runtime 常用的 PG 能力"
JSONB
partial index
SKIP LOCKED
advisory lock
CTE
RETURNING
数组类型
更强的约束表达
更成熟的 trigger / function 生态
```

TiDB 作为 MySQL-compatible 系统，很多地方就不会像 PostgreSQL 那么顺手。TiDB 官方文档也明确说 PostgreSQL 这类 compatibility mode 会被解析但忽略，这不是 PG-compatible 系统。([PingCAP Docs](https://docs.pingcap.com/tidb/stable/mysql-compatibility/?utm_source=chatgpt.com))

所以如果你问的是：

> **从保存 workflow 状态这个需求出发，TiDB 选 MySQL 兼容是不是有点别扭？**

答案是：**是的，有点别扭。**

---

### 但为什么 TiDB 仍然这么做？

因为数据库产品不是只看抽象优雅度，还要看迁移入口。

MySQL 生态的痛点是：

```text title="MySQL 生态痛点"
单主写入上限
分库分表复杂
跨 shard 查询难
跨 shard 事务难
在线扩容难
大表 DDL 难
业务代码里塞路由逻辑
```

TiDB 的价值主张正好是：

```text title="TiDB 的价值主张"
保留 MySQL 使用习惯
去掉手工分库分表
底层自动分片
分布式事务
HTAP
横向扩展
```

PingCAP 自己的对比材料也把 TiDB 定位成 MySQL-compatible distributed database，并强调保留 MySQL drivers、ORM、operational workflows，减少 migration friction。([TiDB](https://www.pingcap.com/compare/mysql-vs-tidb/?utm_source=chatgpt.com), [TiDB](https://www.pingcap.com/blog/practical-mysql-alternatives-tidb/?utm_source=chatgpt.com))

所以它不是从“哪个 SQL dialect 更优雅”出发，而是从：

```text title="产品路线问题"
谁有最大的迁移市场？
谁最痛？
谁最需要 scale-out replacement？
```

出发。答案显然是大量 MySQL 用户、MySQL 分库分表用户、Vitess 用户。

---

### 对你的场景的判断

如果你是在设计一个新的 workflow / agent runtime 状态库，我会这样看：

| 选择                           | 判断                                                                                                                                                                                                                                  |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **PostgreSQL**               | 默认最舒服。schema、JSONB、索引、任务队列、排障都顺手。                                                                                                                                                                                                   |
| **TiDB**                     | 适合你已经需要 MySQL 兼容、水平扩展、HTAP，或者公司已有 TiDB/MySQL 生态。                                                                                                                                                                                    |
| **CockroachDB / YugabyteDB** | 如果你想要 PostgreSQL 语法 + 分布式 SQL，可以评估，但也要接受和原生 PG 的差异。CockroachDB 官方也说明它和 PostgreSQL 仍有不同行为，因为部分特性在分布式系统中不容易实现。([cockroachlabs.com](https://www.cockroachlabs.com/docs/stable/postgresql-compatibility?utm_source=chatgpt.com))        |
| **Citus**                    | 如果你想保留真 PostgreSQL 生态，再做分布式扩展，可以看，但它不是所有 workload 的透明 scale-out。Citus 文档也提醒它不是能 scale out 所有 workload 的 drop-in replacement。([Citus 文档](https://docs.citusdata.com/en/v11.1/get_started/what_is_citus.html?utm_source=chatgpt.com)) |

我的建议很直接：

```text title="我的建议"
如果你不是为了兼容已有 MySQL 业务，不要因为 TiDB 底层强就优先选 TiDB。
```

对于工作流状态，第一选择仍然是：

```text title="工作流状态首选"
PostgreSQL
```

当你明确遇到：

```text title="什么时候再看分布式 SQL"
单机 PG 写入/存储/租户隔离撑不住
并且愿意接受分布式 SQL 的语义差异
```

再看：

```text title="候选分布式 SQL"
Citus / CockroachDB / YugabyteDB / TiDB
```

如果你的团队本来是 MySQL 栈，TiDB 合理；如果你的状态机设计本来偏 PG，TiDB 的 MySQL 兼容反而不是优势。

## 第 5 轮：PG 路线和 TiDB 的成熟度比较

:::note[提问]
好像分布式数据库兼容 pg 路线的没有 tidb 性能可靠性社区生态这么好？
:::

我会把这个问题拆成三层：**PG 兼容度、分布式能力、工程成熟度**。单纯说“PG 路线不如 TiDB”容易误判，因为 Citus、CockroachDB、YugabyteDB 解决的不是同一个问题。

### 基本判断

:::tip[基本判断]
**你的感觉大体是对的，但要限定语境。**
:::

如果比较的是：

```text
开源自建友好度
国内社区和案例
TiKV / TiDB / PD / TiFlash 这一整套工程闭环
OLTP + 部分 OLAP / HTAP
大规模 MySQL 分库分表替代
```

那 **TiDB 确实比大多数 PG-compatible distributed SQL 更成熟、更成体系**。

但如果比较的是：

```text
PostgreSQL 语义
JSONB / partial index / CTE / RETURNING / SKIP LOCKED / extension 生态
普通业务状态库舒适度
```

那 **原生 PostgreSQL 仍然更舒服**；PG-compatible 分布式数据库的问题在于，它们很难同时做到“像 PG 一样好用”和“像 TiDB 一样完整地分布式化”。

---

### 为什么 PG 路线看起来更散？

PG 兼容分布式数据库大致有三条路线。

#### 1. Citus：真 PostgreSQL extension

Citus 的优势是：它不是重写 PostgreSQL，而是 PostgreSQL 扩展；官方也强调使用 Citus 时你仍然是在使用 Postgres，可以利用 Postgres 的功能、工具和生态。([Citus 文档](https://docs.citusdata.com/en/stable/get_started/what_is_citus.html))

但它的代价也很明确：**它不是透明 scale-out 所有 workload 的分布式数据库**。Citus 文档直接说它不是能扩展所有 workload 的 drop-in replacement，性能依赖数据模型、工具和 SQL 特性选择。([Citus 文档](https://docs.citusdata.com/en/stable/get_started/what_is_citus.html))

所以 Citus 很适合：

```text
多租户 SaaS
按 tenant_id / org_id / workflow_id 清晰分片
实时分析
时间序列
大表横向扩展
```

但它不像 TiDB 那样给你一个“全局分布式数据库”的抽象。比如 Citus 对分布式表的唯一约束要求包含 distribution column，否则无法全局保证唯一性。([Citus 文档](https://docs.citusdata.com/en/v9.1/reference/common_errors.html))

---

#### 2. YugabyteDB：复用 / 修改 PostgreSQL query layer

YugabyteDB 的 PG 兼容路线比 Cockroach 更“贴 PG”。官方说 YSQL 复用了开源 PostgreSQL query layer，v2025.1 之后基于 PostgreSQL 15，支持 JSONB、JOIN、GROUP BY、SEQUENCE、VIEW、EXPLAIN、JDBC 等核心特性。([YugabyteDB Docs](https://docs.yugabyte.com/stable/faq/compatibility/))

它底层是分布式存储：表被切成 tablet，tablet 通过 Raft 复制，query layer 和 storage layer 分离。([YugabyteDB Docs](https://docs.yugabyte.com/stable/architecture/))

问题是：

```text
PG 兼容度更高
≠
整体工程成熟度一定更高
```

YugabyteDB 的复杂度在于：它要把 PostgreSQL 的语义接到一个分布式 DocDB / Raft / tablet 存储层上。这个方向很有价值，但社区规模、生产案例密度、中文资料、排障经验，通常不如 TiDB 在中国市场成熟。

另外，YugabyteDB 官方自己也提醒：API 兼容不是为了无脑 lift-and-shift 原有 PostgreSQL 应用；迁移到 YugabyteDB 时，原先面向单体 PostgreSQL 或非事务 Cassandra 的访问逻辑通常需要修改，以适应它的分布式强一致存储架构。([YugabyteDB Docs](https://docs.yugabyte.com/stable/faq/compatibility/))

---

#### 3. CockroachDB：重新实现 PG-compatible distributed SQL

CockroachDB 的工程质量和全球化生产案例不弱。它支持 PostgreSQL wire protocol 和多数 PostgreSQL 语法，大多数 PostgreSQL driver / ORM / 工具可以用。([cockroachlabs.com](https://www.cockroachlabs.com/docs/stable/postgresql-compatibility))

但它不是完整 PostgreSQL。官方兼容性文档明确说，有些 PostgreSQL 特性不支持，或者行为与 PostgreSQL 不同，因为分布式系统里不是所有特性都容易实现。比如它不支持 `CREATE DOMAIN`、PostgreSQL range types、FDW、advisory lock functions 等。([cockroachlabs.com](https://www.cockroachlabs.com/docs/stable/postgresql-compatibility))

更现实的问题是 license。Cockroach Labs 在 2024 年底之后退掉 Core offering，v24.3.0 起的二进制采用 CockroachDB Software License，进入单一 Enterprise offering 模型；小企业和个人有免费条件，但这已经不是传统 Apache/MIT 意义上的开源自建路线。([cockroachlabs.com](https://www.cockroachlabs.com/docs/releases/))

所以 CockroachDB 的问题不是技术弱，而是：

```text
技术不错
PG 兼容不完整
商业/license 绑定更强
国内生态相对弱
```

---

### TiDB 为什么显得更完整？

TiDB 的路线反而更“工程产品化”：

```text
TiDB Server：SQL 层
PD：元数据、调度、事务时间戳
TiKV：分布式事务 KV 存储
TiFlash：列存分析副本
```

官方架构里，TiKV 负责实际数据存储，数据按 Region 切分，默认多副本；PD 管理集群元数据、调度和事务 ID；TiFlash 是列式存储，用来加速分析查询。([PingCAP Docs](https://docs.pingcap.com/tidb/stable/tidb-architecture/))

TiKV 本身还是 CNCF graduated 项目，CNCF 记录显示 TiKV 2018 年进入 CNCF，2020 年毕业。([CNCF](https://www.cncf.io/projects/tikv/?utm_source=chatgpt.com)) 这对“基础设施可信度”是加分项。不是说 CNCF 毕业就一定技术更好，但至少说明治理、采用、成熟度经过了一定外部审视。

TiDB 的优势不是 SQL 方言优雅，而是：

```text
组件边界清楚
运维工具链完整
迁移工具链完整
中文资料多
国内生产案例多
TiKV 作为底座较成熟
TiFlash 提供 HTAP 能力
MySQL 分库分表替代路径清晰
```

它牺牲的是 PostgreSQL 的高级语义舒适度，换来一个更一致的 MySQL-compatible 分布式数据库产品。

---

### 所以你的判断怎么修正？

我会这样表述：

> **PG-compatible distributed SQL 在“PG 语义舒适度”上更诱人，但在“完整分布式数据库产品成熟度”上，目前很难说有一个开源自建路线全面压过 TiDB。**

更细一点：

| 目标                                 | 更合理的选择                      |
| ---------------------------------- | --------------------------- |
| 单机/中小规模 workflow 状态库               | PostgreSQL                  |
| PG 生态 + 分片，多租户清晰                   | Citus                       |
| PG 语法 + 全球分布式事务 + 商业支持可接受          | CockroachDB                 |
| PG 兼容 + Apache 核心数据库 + 分布式 SQL     | YugabyteDB                  |
| MySQL 生态 + 大规模 OLTP/HTAP + 国内落地成熟度 | TiDB                        |
| 自己做 workflow storage engine 底座     | TiKV / FoundationDB 这类 KV 层 |

---

### 对“工作流状态”这个具体场景

如果你现在只是保存 workflow 状态，我不会直接上 TiDB 或 PG-compatible distributed SQL。

#### 小中规模

直接：

```text
PostgreSQL
```

原因很简单：

```text
状态机表
事件表
任务队列表
JSONB
索引
SKIP LOCKED
人工排障
迁移
```

这些 PostgreSQL 太顺手。

---

#### 规模上来，但天然按 workflow\_id / tenant\_id 分区

优先看：

```text
PostgreSQL + 分区
或 Citus
```

因为 workflow 状态通常天然有聚合键：

```text
tenant_id
workflow_id
namespace_id
project_id
```

只要大多数事务都落在同一个 shard / tenant 上，Citus 这类“PG extension + 分片”路线就很合理。

---

#### 规模很大，而且不想自己管 sharding

这时 TiDB 变得有吸引力：

```text
TiDB
```

但你要接受：

```text
MySQL dialect
没有完整 PG 语义
任务队列模式不能照搬 PG 的 SKIP LOCKED 风格
要用 CAS / lease / 幂等 key / event log 设计状态转移
```

---

### 我的最终判断

:::important[最终判断]
**如果你追求 PostgreSQL 语义，分布式 PG 路线确实没有一个完美替代 TiDB 的“PG 版 TiDB”。**
:::

原因不是 PG 社区弱，而是：

```text
PostgreSQL 本体太强、语义太丰富、扩展机制太复杂
分布式后很难完整继承
```

于是 PG 路线分裂成了几种不完美选择：

```text
Citus：PG 最真，但分布式抽象不够透明
YugabyteDB：PG 兼容努力最多，但生态和成熟度相对小
CockroachDB：分布式工程强，但 PG 兼容不是完整 PG，license 也更重
```

TiDB 则是：

```text
PG 语义不舒服
但分布式数据库产品闭环更完整
```

所以如果你问“为了 workflow 状态，想要一个分布式 SQL，PG-compatible 有没有明显强于 TiDB 的选择？”

我的答案是：

**没有一个无脑强于 TiDB。**

但如果你的状态库设计强依赖 PostgreSQL 特性，优先级应该是：

```text
先用 PostgreSQL
撑不住再按数据模型选择 Citus / YugabyteDB / CockroachDB / TiDB
```

不要因为“分布式”提前牺牲掉 PG 的开发效率。
