# mult-editor
## Environment
- Node.js 12.18.3
- npm 6.16.6
- MySQL 5.7.30
- Redis 5.0.9

## Data
- database 
```sql
create database mult_editor;
use mult_editor;
CREATE TABLE `file` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `filename` varchar(100) NOT NULL COMMENT '文件名',
  `create_at` int(10) unsigned NOT NULL COMMENT '创建时间',
  `update_at` int(10) unsigned NOT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `filename` (`filename`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
```
## Deploy
- start
```bash
npm install
npm run dev (or npm run dev-windows for Windows OS)
open http://localhost:8080/
```

- stop
```bash
npm run stop
```
