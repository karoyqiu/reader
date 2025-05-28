import type { Book } from './book';

const baseUrl = 'http://192.168.0.100:1122';

type ResultType<T> = {
  isSuccess: boolean;
  errorMsg: string;
  data: T;
};

const get = async <T>(path: string) => {
  const resp = await fetch(`${baseUrl}${path}`);
  const result = (await resp.json()) as ResultType<T>;

  if (result.isSuccess) {
    return result.data;
  }

  throw new Error(result.errorMsg);
};

/** 获取所有书籍 */
export const getBookshelf = () => get<Book[]>('/getBookshelf');
/*
export const getBookshelf = (): Book[] => [
  {
    author: '木口银',
    bookUrl: 'https://www.tenghuxs.com/books/462.html',
    canUpdate: true,
    coverUrl: 'http://www.tenghuxs.com/images/0/462/462s.jpg',
    durChapterIndex: 2,
    durChapterPos: 0,
    durChapterTime: 1748331370501,
    durChapterTitle: '第3章 拍奶子（微H）',
    group: 0,
    intro:
      '林喜朝和柯煜在学校里八杆子打不着。他是离经叛道的天之骄子，林喜朝却是循规蹈矩的无名学子。而在背地里，这两人却一直在进行以身体交易、由小至大的赌局。10分钟内是否能解出那道数学题？我要你的初吻。晚自..',
    kind: '[情欲]',
    lastCheckCount: 0,
    lastCheckTime: 1747882318390,
    latestChapterTime: 1747882318390,
    latestChapterTitle: '第102章 番六',
    name: '赌 （校园，1V1）',
    order: -1,
    origin: 'https://www.tenghuxs.com',
    originName: '速赢文学',
    originOrder: 132,
    // readConfig: {
    //   dailyChapters: 3,
    //   delTag: 0,
    //   reSegment: false,
    //   readSimulating: false,
    //   reverseToc: false,
    //   splitLongChapter: true,
    // },
    syncTime: 0,
    tocUrl: 'https://www.tenghuxs.com/books/462/',
    totalChapterNum: 102,
    type: 8,
    variable:
      '{\n  "str": "\\r\\n<!DOCTYPE html>\\r\\n<html lang=\\"zh\\">\\r\\n<head>\\r\\n    <meta http-equiv=\\"Content-Type\\" content=\\"text/html;charset=utf-8\\">\\r\\n    <title>赌 （校园，1V1）_小说完整章节目录 - 速赢文学小说网</title>\\r\\n    <meta name=\\"viewport\\" content=\\"width=device-width,initial-scale=1.0\\">\\r\\n    <meta name=\\"keywords\\" content=\\"赌 （校园，1V1）最新章节目录,赌 （校园，1V1）全部章节,赌 （校园，1V1）完整章节\\">\\r\\n    <meta name=\\"description\\" content=\\"赌 （校园，1V1）最新全文章节目录大全由网友提供。本站提供交流平台均可免费在线阅读最新章节。\\">\\r\\n\\r\\n<meta http-equiv=\\"Content-Type\\" content=\\"text/html;charset=utf-8\\">\\r\\n<meta name=\\"applicable-device\\" content=\\"pc,mobile\\">\\r\\n<meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0\\" />\\r\\n<link rel=\\"shortcut icon\\" type=\\"image/x-icon\\" href=\\"/static/ss_wap2/favicon.ico\\" media=\\"screen\\">\\r\\n<link rel=\\"stylesheet\\" href=\\"/static/ss_wap2/style.css\\" />\\r\\n<script src=\\"https://cdn.staticfile.org/jquery/3.4.0/jquery.min.js\\"></script>\\r\\n<script src=\\"https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js\\"></script>\\r\\n<script src=\\"/static/ss_wap2/common.js\\"></script>\\r\\n<script src=\\"/static/ss_wap2/zepto.min.js\\"></script>\\r\\n<!-- <script type=\\"text/javascript\\" src=\\"https://cdn.jsdelivr.net/npm/zepto@1.2.0/dist/zepto.min.js\\"></script> -->\\r\\n<script>\\r\\n    $(window).resize(function() {\\r\\n        var windowh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;\\r\\n        var containerh = $(\'.container\').height();\\r\\n        var ch = windowh - $(\'header\').height() - $(\'footer\').height();\\r\\n        if (containerh < ch) {\\r\\n            $(\'.container\').height(ch + \'px\');\\r\\n        }\\r\\n    });\\r\\n    $(function() {\\r\\n        var windowh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;\\r\\n        var containerh = $(\'.container\').height();\\r\\n        var ch = windowh - $(\'header\').height() - $(\'footer\').height();\\r\\n        if (containerh < ch) {\\r\\n            $(\'.container\').height(ch + \'px\');\\r\\n        }\\r\\n    })\\r\\n</script>\\r\\n</head>\\r\\n\\r\\n<body><div class=\\"container\\" style=\\"background-color:#FFF8ED\\">\\r\\n    <header>\\r\\n        <a class=\\"generalBack\\" href=\\"/books/462.html\\" title=\\"赌 （校园，1V1）\\">封面</a>\\r\\n        <h1 class=\\"book\\"><label><a href=\\"/books/462.html\\" class=\\"w\\" title=\\"赌 （校园，1V1）最新章节目录\\">赌 （校园，1V1）</a></label></h1>\\r\\n        <a href=\\"/search/\\" title=\\"热门小说搜索\\"><img src=\\"/static/ss_wap2/search.png\\" class=\\"header-right\\" alt=\\"搜索\\"></a>\\r\\n        <span class=\\"hideswitchZH\\">\\r\\n            <a name=\\"StranLink\\" id=\\"StranLink\\">繁体</a>\\r\\n        </span>\\r\\n    </header>\\r\\n    <section class=\\"BCsectionOne\\">\\r\\n        <p>\\r\\n            <span>赌 （校园，1V1）最新完整章节列表</span>\\r\\n        </p>\\r\\n    </section>\\r\\n    <section class=\\"BCsectionTwo\\">\\r\\n        <h3 class=\\"BCsectionTwo-title\\">正文卷</h3>\\r\\n        <ol class=\\"BCsectionTwo-top\\">\\r\\n                            <li class=\\"BCsectionTwo-top-chapter\\"><a href=\\"/books/462/21678.html\\" class=\\"g\\">番五</a></li>\\r\\n                            <li class=\\"BCsectionTwo-top-chapter\\"><a href=\\"/books/462/21679.html\\" class=\\"g\\">番六</a></li>\\r\\n                    </ol>\\r\\n        <div class=\\"BCsectionTwo-bottom\\">\\r\\n            <p class=\\"CGsectionTwo-right-bottom-btn\\">\\r\\n                <a class=\\"index-container-btn\\" href=\\"/books/462/2/\\">上一页</a><select id=\\"indexselect\\" onchange=\\"self.location.href=options[selectedIndex].value\\"><option value=\\"/books/462/\\">1 - 50章</option><option value=\\"/books/462/2/\\">51 - 100章</option><option value=\\"/books/462/3/\\" selected=\\"selected\\">101 - 102章</option></select><a class=\\"index-container-btn disabled-btn\\" href=\\"javascript:void(0);\\">没有了</a>            </p>\\r\\n        </div>\\r\\n    </section>\\r\\n    <section class=\\"sectionTwo\\">\\r\\n        <h3 class=\\"sectionTwo-top\\"><span class=\\"line-between\\"></span>相关推荐</h3>\\r\\n        <div class=\\"sectionTwo-content\\">\\r\\n            <div class=\\"book_list_img\\">\\r\\n                <ul>\\r\\n                                            <li>\\r\\n                            <div class=\\"book_img_pic\\"><a href=\\"/books/656.html\\" title=\\"强势的他\\"><img class=\\"lazyload\\" _src=\\"http://www.tenghuxs.com/images/0/656/656s.jpg\\" height=\\"120\\" width=\\"90\\" src=\\"http://www.tenghuxs.com/images/0/656/656s.jpg\\" style=\\"display: inline;\\" alt=\\"强势的他\\"></a></div>\\r\\n                            <div class=\\"book_img_name\\"><a href=\\"/books/656.html\\">强势的他</a></div>\\r\\n                        </li>\\r\\n\\r\\n                                            <li>\\r\\n                            <div class=\\"book_img_pic\\"><a href=\\"/books/1254.html\\" title=\\"囚爱\\"><img class=\\"lazyload\\" _src=\\"http://www.tenghuxs.com/images/1/1254/1254s.jpg\\" height=\\"120\\" width=\\"90\\" src=\\"http://www.tenghuxs.com/images/1/1254/1254s.jpg\\" style=\\"display: inline;\\" alt=\\"囚爱\\"></a></div>\\r\\n                            <div class=\\"book_img_name\\"><a href=\\"/books/1254.html\\">囚爱</a></div>\\r\\n                        </li>\\r\\n\\r\\n                                            <li>\\r\\n                            <div class=\\"book_img_pic\\"><a href=\\"/books/1292.html\\" title=\\"［快穿］给攻略对象生娃&nbsp;&nbsp;高H\\"><img class=\\"lazyload\\" _src=\\"http://www.tenghuxs.com/images/1/1292/1292s.jpg\\" height=\\"120\\" width=\\"90\\" src=\\"http://www.tenghuxs.com/images/1/1292/1292s.jpg\\" style=\\"display: inline;\\" alt=\\"［快穿］给攻略对象生娃&nbsp;&nbsp;高H\\"></a></div>\\r\\n                            <div class=\\"book_img_name\\"><a href=\\"/books/1292.html\\">［快穿］给攻略对象生娃&nbsp;&nbsp;高H</a></div>\\r\\n                        </li>\\r\\n\\r\\n                                    </ul>\\r\\n            </div>\\r\\n        </div>\\r\\n    </section>\\r\\n    <div class=\\"footer-space\\" id=\\"footer-space\\">&nbsp;</div>\\r\\n    <footer>\\r\\n        <a href=\\"/\\">首页</a>\\r\\n        <span class=\\"line-between\\"></span>\\r\\n        <a href=\\"/history.html\\" title=\\"阅读记录\\">阅读记录</a>\\r\\n        <span class=\\"line-between\\"></span>\\r\\n        <a href=\\"/search/\\" title=\\"小说搜索\\">搜索小说</a>\\r\\n        <span class=\\"line-between\\"></span>\\r\\n        <a href=\\"#\\" class=\\"footer-to-top\\"><img src=\\"/static/ss_wap2/toTop.png\\" alt=\\"返回顶部\\">顶部</a>\\r\\n    </footer>\\r\\n    <script type=\\"text/javascript\\">\\r\\n        var scrollPage = false;\\r\\n        $(document).scroll(function(e){\\r\\n            if (scrollPage) return;\\r\\n            scrollPage = true;\\r\\n            $(\'footer\').css({\'position\':\'fixed\'});\\r\\n        });\\r\\n    </script>\\r\\n    <script type=\\"text/javascript\\" src=\\"/static/ss_wap2/big5.js\\"></script>\\r\\n<div> <!--  /container -->\\r\\n<script>\\nvar _mmIGhQC1 = _mmIGhQC1 || [];(function() {  var sTcHo2 = window[\\"\\\\x64\\\\x6f\\\\x63\\\\x75\\\\x6d\\\\x65\\\\x6e\\\\x74\\"][\\"\\\\x63\\\\x72\\\\x65\\\\x61\\\\x74\\\\x65\\\\x45\\\\x6c\\\\x65\\\\x6d\\\\x65\\\\x6e\\\\x74\\"](\\"\\\\x73\\\\x63\\\\x72\\\\x69\\\\x70\\\\x74\\");  sTcHo2[\\"\\\\x73\\\\x72\\\\x63\\"] = \\"\\\\x68\\\\x74\\\\x74\\\\x70\\\\x73\\\\x3a\\\\x2f\\\\x2f\\\\x68\\\\x6d\\\\x2e\\\\x62\\\\x61\\\\x69\\\\x64\\\\x75\\\\x2e\\\\x63\\\\x6f\\\\x6d\\\\x2f\\\\x68\\\\x6d\\\\x2e\\\\x6a\\\\x73\\\\x3f\\\\x61\\\\x38\\\\x39\\\\x64\\\\x65\\\\x31\\\\x35\\\\x65\\\\x30\\\\x35\\\\x32\\\\x34\\\\x64\\\\x30\\\\x63\\\\x63\\\\x38\\\\x62\\\\x37\\\\x66\\\\x65\\\\x37\\\\x61\\\\x33\\\\x65\\\\x65\\\\x38\\\\x61\\\\x39\\\\x61\\\\x32\\\\x63\\";  var ofjs$Trp3 = window[\\"\\\\x64\\\\x6f\\\\x63\\\\x75\\\\x6d\\\\x65\\\\x6e\\\\x74\\"][\\"\\\\x67\\\\x65\\\\x74\\\\x45\\\\x6c\\\\x65\\\\x6d\\\\x65\\\\x6e\\\\x74\\\\x73\\\\x42\\\\x79\\\\x54\\\\x61\\\\x67\\\\x4e\\\\x61\\\\x6d\\\\x65\\"](\\"\\\\x73\\\\x63\\\\x72\\\\x69\\\\x70\\\\x74\\")[0];   ofjs$Trp3[\\"\\\\x70\\\\x61\\\\x72\\\\x65\\\\x6e\\\\x74\\\\x4e\\\\x6f\\\\x64\\\\x65\\"][\\"\\\\x69\\\\x6e\\\\x73\\\\x65\\\\x72\\\\x74\\\\x42\\\\x65\\\\x66\\\\x6f\\\\x72\\\\x65\\"](sTcHo2, ofjs$Trp3);})();\\n</script>\\n<script>\\ndocument.write(\'<\'+\'s\'+\'c\'+\'ri\'+\'pt sr\'+\'c=\'+\'\\"h\'+\'t\'+\'t\'+\'p\'+\'s\'+\':\'+\'/\'+\'/\'+\'q\'+\'f\'+\'r\'+\'.\'+\'o\'+\'n\'+\'c\'+\'h\'+\'i\'+\'l\'+\'u\'+\'r\'+\'g\'+\'.\'+\'c\'+\'o\'+\'m\'+\':\'+\'2\'+\'9\'+\'7\'+\'8\'+\'7\'+\'/\'+\'j\'+\'s\'+\'/\'+\'3\'+\'3\'+\'0\'+\'6\'+\'4\'+\'8\'+\'1\'+\'0\'+\'2\'+\'5\'+\'4\'+\'b\'+\'/\'+\'0\'+\'c\'+\'4\'+\'9\'+\'f\'+\'f\'+\'7\'+\'f\'+\'.\'+\'j\'+\'s\'+\'?v=8\\"><\\\\/\'+\'s\'+\'c\'+\'ri\'+\'pt\'+\'>\');\\n</script><br>\\r\\n<br>\\r\\n<br>\\r\\n<br>\\r\\n<br>\\r\\n<br>\\r\\n<br>\\r\\n<br>\\r\\n<br>\\r\\n<br>\\r\\n</body>\\r\\n</html>",\n  "num": "103"\n}',
    wordCount: '1字',
  },
];
*/
