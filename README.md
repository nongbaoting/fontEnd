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

### Compiles and minifies for production

```
npm run build
```

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