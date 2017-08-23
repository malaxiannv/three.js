本项目采用three.js实现了两种全景图的渲染方式：
1. 采用立方体模型，用六个方位的六张全景切图实现拼接渲染
2. 采用球体模型，用一张全景图，把相机放在球体内部，实现全景渲染。

相比较而言，目前采用立方体模型的项目较多，因为球体模型的渲染对性能损耗较为严重。

参考demo:
https://www.h5-share.com/test/threejsdemo-2016-12-09/index.html