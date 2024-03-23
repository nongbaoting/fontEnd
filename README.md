# prot

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

编辑package.json 改端口

```
npm run serve
```

### Compiles and minifies for production 编译发布

更改链接Django: /training/nong/web/Dev/prot/src/main.js

确定发布vue放在那台机: vue.config.js

```
npm run build
rm -rf /training/nong/protein/db/web/protein
cp -r /dat1/nbt2/server/PROTsim/prot/dist/ /training/nong/protein/db/web/protein
```

### 发布aliyun
cp -r /dat1/nbt2/server/PROTsim/annotatePDB 	/var/www/html/PISA

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### run structure prediction server in host 222.200.186.47

keep runing

```
python /training/nong/web/python/run_predict.py watchdog
```

### run django

```
cd /training/nong/web/prot
source activate webProt
python manage.py runserver 222.200.186.47:8989
```

### web host

```
/var/www/html
```

### start vuejs

```
vue ui
```

# 找不到包

# https://npmmirror.com/sync/phylotree#logid=624ec406115901000a70a3ce
