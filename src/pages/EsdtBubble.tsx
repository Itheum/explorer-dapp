import React, { useEffect, useState } from "react";
import BigNumber from 'bignumber.js';
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { SignableMessage } from "@multiversx/sdk-core/out";
import { signMessage } from "@multiversx/sdk-dapp/utils/account";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { ModalBody, Table } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { Bubble } from 'react-chartjs-2';
import { IoClose } from "react-icons/io5";
import Modal from "react-modal";
import imgBlurChart from "assets/img/blur-chart.png";
import { ElrondAddressLink, Loader } from "components";
import { EB_SHOW_SIZE, ESDT_BUBBLE_NONCES } from "config";
import {
  useGetAccount,
  useGetNetworkConfig,
  useGetPendingTransactions,
} from "hooks";
import { modalStyles } from "libs/ui";
import { shortenAddress, toastError } from "libs/utils";
import { BACKGROUND_COLORS } from "./CantinaCorner";
import da, { scaleLinear, pointRadial } from "d3";
const rawData = [
  {
      "address": "erd1qqqqqqqqqqqqqpgqa0fsfshnff4n76jhcye6k7uvd7qacsq42jpsp6shh2",
      "balance": "281826106163104426902486"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqeel2kumf0r8ffyhth7pqdujjat9nx0862jpsg2pqaq",
      "balance": "158739170456025994066136"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqpmud7t8uprrxzgu8eq2mtkl08kesflj62jps9j8dyh",
      "balance": "44879870146955944917828"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgq0lzzvt2faev4upyf586tg38s84d7zsaj2jpsglugga",
      "balance": "37976100370553739504345"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqav09xenkuqsdyeyy5evqyhuusvu4gl3t2jpss57g8x",
      "balance": "36145656707513611452400"
  },
  {
      "address": "erd1d5na7497xqz322uk4kadkjncxtv9tjg34jgl6867nhhqx5j9t74s6mv4c5",
      "balance": "33916809560112269931154"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqp5d4x3d263x4alnapwafwujch5xqmvyq2jpsk2xhsy",
      "balance": "31426671283191955842085"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqf57y8m9krsvrceqxujngzm77p82zqc502jpsnnezqs",
      "balance": "28044882407632120015336"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqtjhhs49h0q2ncld64l3thtk7s7yuw47v2jps8emt0v",
      "balance": "26801460571251341781413"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqt0uek344kaerr4gf9g2r8l0f4l8ygyha2jps82u9r6",
      "balance": "24608501958890560523076"
  },
  {
      "address": "erd19vwhq2l9fqc23tfdsafu5qchw2y89t72epu000glu4xtmatn8xssc0nlw7",
      "balance": "18326786664732667957852"
  },
  {
      "address": "erd1gl0ufgv8wywywl5p26eldswkrasuur398l5h0gdjl7c76q2naj9sks4sfa",
      "balance": "18252077044391280633052"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqrmmtjjpafk4j3nsgeu8frn8n5mls5e802jps380mx5",
      "balance": "15001190182041889957422"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqqz6vp9y50ep867vnr296mqf3dduh6guvmvlsu3sujc",
      "balance": "12022083623857144813623"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqq6y660esmedtm0neqwgkddfezuys68k42jps7pu0r9",
      "balance": "9928360903719143686712"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgq5g7xxmpuf6nmux3r3spjxv0wleyypz8q2jpsyc3nh8",
      "balance": "8037977402781161753285"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgq5fj4ttp8vylx8napuuruye5rewflqr542jpsv8tauj",
      "balance": "5337067691296457587694"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqp32ecg03fyxgt2pf2fsxyg4knvhfvtgz2jps6rx6gf",
      "balance": "4521641299142016334056"
  },
  {
      "address": "erd1cwvwju3w3w5jgz3nlu0txy5mv37czk0504ezgjnmp7fxcrtz52kqsk8lwu",
      "balance": "3238161971039679098545"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgq5l05l0ts4lphdktx33apl0ss9rzf4r244fvsva6j53",
      "balance": "2880979782840164058967"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqs0jjyjmx0cvek4p8yj923q5yreshtpa62jpsz6vt84",
      "balance": "2724777179707891726285"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqc9q8acdqxz84p5p4ghc7gkrc62smjfnr2jpsd9azcd",
      "balance": "2557294921050225873155"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqw382rcxku8adtwahlq2pdstdvfwf4wa72jpssz8c8s",
      "balance": "2234104996757898702366"
  },
  {
      "address": "erd1p0q284evx4e205pvu25ucqzr6g9rgy93kcc6jk9k72anwfxqdeuqcwyml8",
      "balance": "2131719826200288378070"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqdx6z3sauy49c5k6c6lwhjqclrfwlxlud2jpsvwj5dp",
      "balance": "1948852412043843859036"
  },
  {
      "address": "erd1860rt9k8ddac67r9r4mwrhwe5wdu2tnryf2nm7ksl4jhwxlapv6q859d6u",
      "balance": "1802845746369975364577"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqj6daemefdk5kjgy9rs4zsng03kezgxdm2jps3h5n07",
      "balance": "1592097542016973205871"
  },
  {
      "address": "erd1wjy499wf8gmq8hevahyazcte84el3anjqvv99l2uth5rtd979z6qfly2jc",
      "balance": "1552784444566282946486"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgq9nnx7n40snv899ejwcrtepc5qn6apxvm2jps88s0v7",
      "balance": "1351000000000000000003"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqx6eg4kfqyw7ayktynn9wzhd6grv7p8542jpsj6y036",
      "balance": "1188581897857327566690"
  },
  {
      "address": "erd1cedqmdgnhgpq6rvrmzer2q44fh45a6wkwktut09yvm4qkth59egqs74l4a",
      "balance": "1107949209232842706970"
  },
  {
      "address": "erd1e20vmmt4gs2kjfaxyl437d2hzppzunhx5qatwsez8t3v3a7gvqdsztaecy",
      "balance": "1054478153300673851456"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqmmxzmktd09gq0hldtczerlv444ykt3pz6avsnys6m9",
      "balance": "1040969965243564402296"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqsw2zvzfwskwqhtkkdgtumjlj2x8mlh8e2jpsk8rpjl",
      "balance": "1014900769572045532592"
  },
  {
      "address": "erd195v2qrm9vvrr29t2ddp7zvyd4ylze8ujknxpzng0t2tcj4lexu9sdvjxt2",
      "balance": "1000000000000000245760"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgq4ym2z7j0cj6efnm892w09dx7khutaj0h2jpsyxawn5",
      "balance": "817291730281208425091"
  },
  {
      "address": "erd1cst7hw94qwe3y99u0e789v494s7ed62lskwhf2ppdd9nl0v2ts0sak88y7",
      "balance": "750329940652183054007"
  },
  {
      "address": "erd19xz7jntt7wwfmdtqrm8z8tzned82tntnvgpgs2w25nw65r6u98qqpyjx0u",
      "balance": "701500747577072084880"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqzjctu8xrgn8jmfp503tajjvzz2zq60v92jpsslkh5a",
      "balance": "540679207495695546620"
  },
  {
      "address": "erd1kvcj5tn2t7fdgj53zeq2e2tx6wrklxepwh6fgyxcxwqhx84wrqrsne4dvs",
      "balance": "534882219322894848383"
  },
  {
      "address": "erd109k2t63qpwjz0z6rz6vlhsjfq4d5jckdlay52wqz2rqzln5w9heqdyslth",
      "balance": "530131618948730967630"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqjsnxqprks7qxfwkcg2m2v9hxkrchgm9akp2segrswt",
      "balance": "524804432312208788867"
  },
  {
      "address": "erd1xmygnhhjktysmvymzzduvhrquqmh7ryc5akrlhpcl6a5xcejtunsz9rtuf",
      "balance": "523722901311196272968"
  },
  {
      "address": "erd1epe590yetj9agd75t475nk6tk4ctjpvjya0v569qhsa2347ynmhqynxjrw",
      "balance": "522939242511749666173"
  },
  {
      "address": "erd1yp587zmehjanwlyk93vwtwwset22y3s2a2hngh892z7e5rvy9ncsqe9wkk",
      "balance": "521572267212221443149"
  },
  {
      "address": "erd1qx7zchwf0d00n5rpqlvm2y6wyxj85tu297zs7s7mmhydkej6c7zsd9zf5q",
      "balance": "518124275103772845071"
  },
  {
      "address": "erd1gmcl5nfmucklpfrrwwhy9jvdxlzsmdk5xlejzprn6zmsdzkdy72sku9u35",
      "balance": "498307548018181510186"
  },
  {
      "address": "erd1vmgc26y00av6j0c2uahk22hkpnev5j83as7c3kuxx97wec2ma2eqrg4rnw",
      "balance": "448000000000000000000"
  },
  {
      "address": "erd1ml4r6rnumj3tqpqsu2udv5n3axrahr37hpxlzrrqnfercdt46jvsnl4r4q",
      "balance": "436635704210829101312"
  },
  {
      "address": "erd1rfnd4v2u52uh5snm488daljj0qlfr749r9af6gkwu04pr0m0e0tsjs67kl",
      "balance": "429528901952225248418"
  },
  {
      "address": "erd1y9muck9tzxxgjgyn20tgcgttyd362awvptjcgmwvgafmhfl65was6sark5",
      "balance": "400221230476434892316"
  },
  {
      "address": "erd1zenqn45ds8d488yked3n8dzh6hj4sv6srvnvc54zqz92sahh74lqj674c8",
      "balance": "392861964747405785319"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqzmjm474k89alpve4gp7x4gz25wfj4xzv2jpsy2my02",
      "balance": "381865402001886747328"
  },
  {
      "address": "erd1m2zxn6vs05h09yem5q5ec4ek5wagcs3uyfgxjy2syae9p757w52qswfvsf",
      "balance": "378277303820453574978"
  },
  {
      "address": "erd10w04zvukckl8qsrlacstwp3vy8g77njmxfmnkf8ykgqyk57vnumsg4sw3e",
      "balance": "365915593193845190878"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgq96n4gxvmw8nxgxud8nv8qmms5namspc5vmusg930sh",
      "balance": "353514087085605253403"
  },
  {
      "address": "erd1hn5ddtat6k4pq5u6s6cju2xpznfawse4aexqv2gum2ljen2xlals24y06w",
      "balance": "350126166822217252803"
  },
  {
      "address": "erd1kr6xtp922007g0jw5kxmvqxn2ptf3568f6tdaakqprednaxsdusqxv9qsr",
      "balance": "347546460893909335675"
  },
  {
      "address": "erd1mvh9as6sz87dzqmrm7e03ml86mz6h8t6zscckg6vjj7403mk88aqqudd8x",
      "balance": "331236742075597834813"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgquenuwz852khuxcau49md27wk2qp03v4s6avsdvmxkc",
      "balance": "330326315684519231972"
  },
  {
      "address": "erd1xphggky4cd5kugmlnu2l4gscpy9kvwja98y2fgfhmt7zpwh6rqes4xtmu9",
      "balance": "326092005253549470929"
  },
  {
      "address": "erd1pwparn8wf3342cm9tpd5wt257qsjkfyl7867lqlcyxvc3hkzm94su7vftf",
      "balance": "303295735065774934654"
  },
  {
      "address": "erd1ukd4kd2p5x7fh7qnehct550z9clrznjpes9fxfccq5wyuphgft3sqx9qmt",
      "balance": "300415221711362760751"
  },
  {
      "address": "erd1qz6mv7h7sr5zenr2ey56lr7huwkkjxzdgfetx3vzu60yz5xp007qg5pvw4",
      "balance": "300000000000000000000"
  },
  {
      "address": "erd1ycu40jeaytl88zf5cu70jz3s7msymdpa0x8x4wfy88wnjk6zzgdqswdnre",
      "balance": "300000000000000000000"
  },
  {
      "address": "erd14yuv5yrcyvms0rmrt8cpggvs98s4lhkpz5f0d4snuj4j6yxdfrlqdex43u",
      "balance": "295479983389509349775"
  },
  {
      "address": "erd1vpvkzgqw7x33w7d88desk6vs7scyznj5zplutku9xcf5xx786lvsz5r8pv",
      "balance": "292156450983674785586"
  },
  {
      "address": "erd1lusgm4jtjhe37qyqrjr6ev90n75gspd2d2xphwefk63p0n8lfcnqua549h",
      "balance": "289701491082206967586"
  },
  {
      "address": "erd1qkdednmptugj3cvy2m4yxn97g3rr8pzwn3vyeqghygf9w60dkwvszrpd40",
      "balance": "286175956337977245716"
  },
  {
      "address": "erd1qxtvldwx4t7zkdn9nwwjn8cnj9eg6zu26a0fstk0eenxetrare2sv7scyc",
      "balance": "278392666141740793633"
  },
  {
      "address": "erd1fz7gu589xvvka0ct9ddnyqcesttnsux8u5npg6dsn7qz6cgupllq297y24",
      "balance": "275000000000000000000"
  },
  {
      "address": "erd175ak5jgwt4t72npw6gqj2w5g5sk59lzk5qrvx67ftsc47q84m6qs6u59p7",
      "balance": "270000000000000000000"
  },
  {
      "address": "erd14mr36mzllagaea7035ew56t4ndqdcy02vdf37l39fummemzlnensezgzef",
      "balance": "265958030000000000000"
  },
  {
      "address": "erd1qqqqqqqpy49q3q7qcgk99em8vtyaqvu2fjdwu5f7s2anwqgmhges359dv2",
      "balance": "264460250936843121110"
  },
  {
      "address": "erd12f0ftxkcgemqrdvjrzsjeetyhg9ck7d6p36wkxlszv67kr7nd57qas29cx",
      "balance": "262535421440685963572"
  },
  {
      "address": "erd1lp8m2fczk0mcpcggcm4j8sl5ymurh5wp9wmy4vnu8fqa8wjppvesuav0c6",
      "balance": "260604999940238309667"
  },
  {
      "address": "erd1lapzkgcmsvs7u43ga6rsc0jq4r0atefznt0m3patvtwwqz5u990syrmxty",
      "balance": "258322224662856410945"
  },
  {
      "address": "erd1fva3rk04jy6d430rtejsvn8s2mp7vc5vsrsqa4quu95je0neqr2scxsvc6",
      "balance": "256197606848073923206"
  },
  {
      "address": "erd1s8u97w9s6cmzlqaeteffsg3ay7046mcmrezkp4r0hylvh49vymdsxm0wwc",
      "balance": "250000016011767947354"
  },
  {
      "address": "erd1y7v734tcjfntyr49572a3aahnr5hay33xayjg88jqjjwa6emtq9qghe5dx",
      "balance": "245500384852116345734"
  },
  {
      "address": "erd13eznhq22az4s09xh30xwa88r3fgre05qvm45pes9v4du6zdfxpzq2nc9l4",
      "balance": "241272273650533426849"
  },
  {
      "address": "erd1qqqqqqqr2lrttcyxr4fwhfpa8f6qv39pl238r63qq9vkflc8ec7sw9es80",
      "balance": "234150137485906612139"
  },
  {
      "address": "erd12v8m978dkrp44upuh9msnz6c393rfmqehzn39rsthtwu64646wdswlqsa4",
      "balance": "233867231464981040587"
  },
  {
      "address": "erd1e58m2hjv2c5mwsf9n59gq9nxfanpvfcccacv9jtzeqfjvtrkjy2q0nhcy4",
      "balance": "233363829465400528353"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqh3c7mg0dfe5z0t3468wwp08xz3ex25ah2jpsv4pcdl",
      "balance": "230535724074495505122"
  },
  {
      "address": "erd154sgzaah4mmz46lg8t88aaqufyx7vgadcurndxd6laghmmzzq7jqyyu6g3",
      "balance": "222949769502822381248"
  },
  {
      "address": "erd12gv52u9huljw88rdum9zqmwa2mue7hdc3nwkw3nu4rdcfgffflrq8ec6w8",
      "balance": "218801101352512590492"
  },
  {
      "address": "erd1qqqqqqqqmv6r40r93nczh5gj2pnyy2gqkhr8l4dnwxmcp3dt5r9s4sqz8d",
      "balance": "218568368774870968441"
  },
  {
      "address": "erd177jvs29racvq6zmxmuuphcervmjj6rs95gelvdz6xuvsdhl3wxaq4rwrmr",
      "balance": "216211731266923562537"
  },
  {
      "address": "erd1gcapxt6e8rmu3a5es8y0m4jzjqylrjhrrja6f4rzvg4rpspf86nqkcqhka",
      "balance": "215245701577286146697"
  },
  {
      "address": "erd1ryng56mquxatp5smraaz24p9823gct6gf6k0thq6jt0cqu7hp9dsuw3yg6",
      "balance": "211882607170968468080"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqy8ufy6h4uyxzjsxe0kzfszsjd7myphzz2jpsrf7hkv",
      "balance": "211376818358103075897"
  },
  {
      "address": "erd14zkqw368xkkhswp6qlvt7xj2080lrtcm3d5zc5hzpugsj065wauqm28drh",
      "balance": "204884985353886203403"
  },
  {
      "address": "erd1xmn5qzqzwulf0dazj9sdrwc85s0nmt6q5w333s20p9g30ff4932qdmfzwx",
      "balance": "204352993450060817332"
  },
  {
      "address": "erd1z3fplu5gy4fdhngzlp6ddk9t328whlnh0nudkgqdh786chn4pkhsrg6qf8",
      "balance": "204128479156984988727"
  },
  {
      "address": "erd1875e8wutq5r52gmz20srjgsprvfl5y9mcqd74eq6cmjml0w542vs2ae74w",
      "balance": "203910407598984350884"
  },
  {
      "address": "erd1l5aq3d7whv9mfc2kgclhc66r6mrnwksf5fnckg73xkky526fa2kqa0l8yd",
      "balance": "201732794217633593489"
  },
  {
      "address": "erd1lhpp0nmewy25k79lap6tw9c32tsjmumlqkt550evhg95ezq00scsm2qc83",
      "balance": "201291739736952055518"
  },
  {
      "address": "erd173dfnu8d7xpgt3n93qp55axajy3jvdthdluke7st7pfgluafyljsa48pa6",
      "balance": "200018929296134147261"
  },
  {
      "address": "erd1w77lzgwcx096fytcj0umn4vfklnwjj3u65e9ced9zwlmw8myp8rq0n4gqq",
      "balance": "194644642341965808605"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqn8nsu24g9lca74fw0lus2garvhg2alfe2jpsqlysng",
      "balance": "194273363719046249824"
  },
  {
      "address": "erd1c8m9tmd7tf5nnq9u29vxz9ps358prxarcnz3kt8lazc97a3nfnas6usc0z",
      "balance": "192978052623108567824"
  },
  {
      "address": "erd1hk55hq54eetlk9uf6l3wjlldmfztm09grlfrc2yaru5wlfpvtnustadhf0",
      "balance": "192508185932709820633"
  },
  {
      "address": "erd1mn4d5fg5qdvlwqhw5mhy66p85mxg7483j7mqshqleqrw430s3qkq888ecp",
      "balance": "190788014319692013344"
  },
  {
      "address": "erd1qqqqqqqyqlhyaauurt43j4q3mvedt2n59c5gj2u8jflfyfn4wlmsqqn9sw",
      "balance": "186942117339476154651"
  },
  {
      "address": "erd1l339mpnl8wyajkzv9gtnusngjdeveqg82m92kmh0kzee0am2vugsvw94ux",
      "balance": "185776469142647581628"
  },
  {
      "address": "erd148f7ejhjy36wdv26d6pcd9h90p0z9wldge5pyw7aexyl0czkn23qswrskm",
      "balance": "177411512866174562425"
  },
  {
      "address": "erd1zl08tr8a8533dudq43n4tl4avpacaus6zxv0ztffsm8xfgz5ymzs6dplpc",
      "balance": "172073273822767673824"
  },
  {
      "address": "erd18vjvearhf7ehj6lqh8rmm73vfhxzselt4x4qtq0plzeafra7ddfq759pfp",
      "balance": "170580042515121795569"
  },
  {
      "address": "erd1u0wyar22pgude0gn7ajw5n5c6su7k5dgyz5l3ardy63c5y7wqmnqt7luq0",
      "balance": "167977047827692043344"
  },
  {
      "address": "erd1gcyfumx8fs75em5ase55uhq0qelzxmwfpfg5clq6hd9dqejrn6zqg4t7ua",
      "balance": "167759544014594238423"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgq0kuu95frvqj4vjgntzygu9crhlwfh9y0s28sz2dv4l",
      "balance": "165285148418590469483"
  },
  {
      "address": "erd1hcj6x53ztuh20xhyezunnfhlteukvtz8e5pd8pqt55lnvyk6wnkq3788cp",
      "balance": "162303071768059703519"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgq575mqgaqe4f53rqc5ssczkxtsx4fs26l3azq9zwkaw",
      "balance": "155475661859599409456"
  },
  {
      "address": "erd1hz65lr7ry7sa3p8jjeplwzujm2d7ktj7s6glk9hk8f4zj8znftgqaey5f5",
      "balance": "153640009848026446738"
  },
  {
      "address": "erd1djnq0w7fyc0ddh89r3vwe5pkty88vgea2nk67wj22wj4wa4rawkslgwaea",
      "balance": "153389907662165877448"
  },
  {
      "address": "erd16k7c4chjmkeg0gmj47dwefw042sma0p3r0lpyfeeqc3uge76kndqc2zdus",
      "balance": "151793272905598213611"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqq93kw6jngqjugfyd7pf555lwurfg2z5e2jpsnhhywk",
      "balance": "151369775690817467545"
  },
  {
      "address": "erd1ttz0x9d9e23526fhe7hc4zkg3zgh2yzse4dc9g8dw545ha3rhmystj80nv",
      "balance": "150963910139755368231"
  },
  {
      "address": "erd1dh0ym83h8xgpmmym7x2x0j92vcg5lqygfn0x7362xt80xcmy85ws4rn65k",
      "balance": "149371811519231657341"
  },
  {
      "address": "erd1qkkdya9chrk7zvfurzml6edvluvrtaxrmu5zar9nk8xgx96pnwws2xq5r5",
      "balance": "148812343437298012630"
  },
  {
      "address": "erd1qs4076pyl28arzgyn24d8v24xqm3mf9zdsgd3857tyu56ypmy76symj5fu",
      "balance": "148664467978987056003"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqtga4sxnc462aeqdpxxajs8k7pr64ltkh2jps3ewwyw",
      "balance": "148579054384971938515"
  },
  {
      "address": "erd1xm39mzz72e2kh7h4srtdf9h7wspen25yunf6nrhx09f83e0grjcss8zppn",
      "balance": "147803250722310271142"
  },
  {
      "address": "erd1l5lrzkr2xamyhu4gzvvt0amgde3znye0sfyq59sxzy7zhaws7e8qugw7am",
      "balance": "143788133382650931928"
  },
  {
      "address": "erd16skreruuehjj6ys39gs62fv5cngc6lx3ecxk7l7mnk2zfvhsaxtqzwxt9e",
      "balance": "143439195810972772863"
  },
  {
      "address": "erd1ssy0a3tka6564rs55ay3n9kca05zplhpszj854sehvxh2373sx6slv2em3",
      "balance": "142387053417502278930"
  },
  {
      "address": "erd10zn7mupqaqtaxstleegansdcv9qjf5jymr8y75pu5q9sgrdylzysnq8qe8",
      "balance": "140968217992263762498"
  },
  {
      "address": "erd1j0jd0l7elg5mef45tf4nxlqjaczhvzhqy429pce8y8pugdjx3csqm3xm4r",
      "balance": "137217128014713522132"
  },
  {
      "address": "erd1kk7udtuy56y4u040586wrdlzt26h4h3srjhm7e08kzgd93x7gxyq7pdlma",
      "balance": "136462846896831270294"
  },
  {
      "address": "erd1mklp0udqjtrxcuqqfjkur3nd3fa6svfuvqtq0tvtednjz68eswlsa9trxj",
      "balance": "135928949591999385610"
  },
  {
      "address": "erd1tv9e2hq43qmzq8qv0sutawv8r9yj0zpla6wmf600a4qct9yllfuqjsqhl3",
      "balance": "131679450575306672831"
  },
  {
      "address": "erd12xy8vynsjmuvarc3m866a30ggezrdmvln5r5886z5uums5ceunmqut7p7w",
      "balance": "129970322630381787227"
  },
  {
      "address": "erd1z67vkl3tnrr20gfk5v5dlc8v4z0fkj336em69ey7slq8ned0quhqg0yf7z",
      "balance": "129926073723745145407"
  },
  {
      "address": "erd16y2sts57h3jlstkmhm3le2wtjp029ga62rrm6pe3mgajcg5nlhxs4yrp9y",
      "balance": "125151083386078607461"
  },
  {
      "address": "erd124fwu9yg3ep6mv525z9htvskxcksxypsa4u6dv5qxt5s3gs9y0ds6d0hx0",
      "balance": "124880231065750392232"
  },
  {
      "address": "erd1r276ggaue2ha9w5ks4m67ry3pgysdkpn6x7yg59jf083d23kyg8s3rkpnv",
      "balance": "123970268925237505883"
  },
  {
      "address": "erd1fhmldx5emvuf4th5hh7qpqhtaj7cak256e8ueqjt8pyxx8zf08xsgh8pjw",
      "balance": "123329519750663411909"
  },
  {
      "address": "erd1mzkh3t2mthueptmvse2kzrg8ww2e3lg4dmv3eq8smjs0hl5na6as788jha",
      "balance": "122545883353708316877"
  },
  {
      "address": "erd13d0v6jxgr39m6htrnslrd5qmstjkxxc00ketj48rew9shr6p5l2skydc05",
      "balance": "120490684249562792655"
  },
  {
      "address": "erd1xw5hzt5wz6h4rp0y8p3pqxdvzptrt62cf2q92wf9sk8cp6w3fe3q395cvw",
      "balance": "118859010859231617392"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqeu3wyjdsfq8kyhs3p9etq6carzjduwrzgaqsl796r7",
      "balance": "117100000000000000064"
  },
  {
      "address": "erd1a5vhda3a5r883alwhhtecjp93r445u6vaksk4m9eyg0nxx6vvpzsplm05w",
      "balance": "115220950649922213591"
  },
  {
      "address": "erd1e794x73k838hhd82enrhh0fzfjcx9cf0gy5l854gnfvxd5ydvkns9yqh22",
      "balance": "114627111811836831607"
  },
  {
      "address": "erd1adfatltsa3dxj42w2z84h6rskkpnvvfgyx2skv0ejj0cev8ljcqsane0j4",
      "balance": "114359496115717691619"
  },
  {
      "address": "erd12a7a9r2s53g7uh4jz3npehym24usxsh655sr8m7cf3tfkgc0aqjsfvxh6k",
      "balance": "113797481943253073666"
  },
  {
      "address": "erd1mk8r0cdxkqgc889lz0sp239l7dlzyfl9jwtnglvamceh4wpnaursxkt43x",
      "balance": "113118837604778885700"
  },
  {
      "address": "erd1dhq5z8wuj09xm0wzn56rqhnhhsp64zkxhd9x48yuv00gyehqltjsgv8x7y",
      "balance": "111858475949028796732"
  },
  {
      "address": "erd18y5hrr47cy94cp2uh49sm9x0vakrkv0hdm7kxhhend42v3vfcf5qvs3m2f",
      "balance": "110916633536801213643"
  },
  {
      "address": "erd1qqprdpu6g4q0myfh63fwraez7n2aq7qft89dz5fseyavp686nzps4gq9ny",
      "balance": "110764683271000060673"
  },
  {
      "address": "erd1hktl0s5kac5pxgyzhw9lkm2eyvn5ad6nq6g94zd6484arp22qlhs9usdk4",
      "balance": "109383302145607648849"
  },
  {
      "address": "erd1tq5rfz6kfg5ggt59pg84dfukup366zl2ups9vw4qvu5a5hkaky7q222rzj",
      "balance": "108666143413529119187"
  },
  {
      "address": "erd1h4t3n4ddwadxmc6ss5j4ny3efy7et8gr0x3twyqqdgwwgvqsvx7s8s7uvu",
      "balance": "107920306634432365842"
  },
  {
      "address": "erd1nn7epl498h4lnlt03y2sgnf0z3qndwvt28ctd0t4rprnayl5kx8qlqavp3",
      "balance": "106988629966871923201"
  },
  {
      "address": "erd1e7ycjzurhan9tcryu5t65sv3pcj0rg5xh490cg9mmpy7k582zsgsyufld5",
      "balance": "105000000000000000000"
  },
  {
      "address": "erd1eynw4d322tls9gxgw4kw5669tzs20zqjn397hglt99l87nryzt4scpl52u",
      "balance": "104857294866661154489"
  },
  {
      "address": "erd1h6haqlyvwuk2u3mmxnyf4zdc9puq4mfh9pss0p7x5az0zhmkh5gq8x948l",
      "balance": "104671084428004524193"
  },
  {
      "address": "erd10cv6jwjkjphgdk72jfksm4ujnazmyv0frl7tusstxauny0mfzt0q84dz9q",
      "balance": "104295843556303561540"
  },
  {
      "address": "erd1ras3s2hj686cewrjfw4dn8a22msu74c6jt7qu77yf5r6zmvmh4ashz945h",
      "balance": "104070663808232248439"
  },
  {
      "address": "erd1k4c4n0huf0ehpszvx92qma0qg4fwy48c0uxvzj2c66waxya7pnssml4prl",
      "balance": "103441416900030317384"
  },
  {
      "address": "erd1xv3k26t7asc2g82ht5r8tlp7y2gqjs7dn5je9q4r27cjn6eacgmqkfjv08",
      "balance": "102496335179950760025"
  },
  {
      "address": "erd1up40nc0wgvks77rnmtgahtwhy46ddyfql8nlq7l9acqhm0ugvf7shsapzj",
      "balance": "101244568978647548578"
  },
  {
      "address": "erd188ye2ur9ruj8hxmk0jrcmdgnz7c39dvh8f593g8f6cdl8rv6jgjsqw066e",
      "balance": "100813388378487206814"
  },
  {
      "address": "erd1mfmrn5wp77s2hpthgkslptph0y8vh3mqmshe3eazpmcwa2lj5fgqh34hje",
      "balance": "100000000000000000000"
  },
  {
      "address": "erd1m75szd4nzlsgh0dj5rwrdamfse49pculvxs6zx0h67ljq65uwxdqcvxkgx",
      "balance": "99689329041246691617"
  },
  {
      "address": "erd1kmv83k7gle03uz5stkd8ypfp5gn7z4ht35vdu0gll2mp9mmzdy6srswzkz",
      "balance": "99309210999726117780"
  },
  {
      "address": "erd1pqjx5uh2andgcmnt2gesqgrd9k67ecrjh3thxfhnxesqte5l3mssz9e2cx",
      "balance": "98952826674940995840"
  },
  {
      "address": "erd1vvtua4p3mehll9yzchs0uf8f0spr76c582heh3g65h92w6uvag3sm2u8jp",
      "balance": "98778981873667379056"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgq38cmvwwkujae3c0xmc9p9554jjctkv4w2jps83r492",
      "balance": "97548848352072071541"
  },
  {
      "address": "erd105kysyugnspafs79lr749fqry6pudse468wya7xy4fjkdlskx7ms2kuzcv",
      "balance": "95627197749733665630"
  },
  {
      "address": "erd1sd77c3mr74u0tjjy460uf56p5a66l9hp6h86f8rgphvs9sdhlhns26cf4a",
      "balance": "95483916716262604496"
  },
  {
      "address": "erd1aamaevz0lj782xz3c3fk4f2l35l5k5eah2g5qg2zlss47xpavxdsvhs9n4",
      "balance": "95021114133776914925"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqr6meam29vr2wk3xpc2egfsj43qcxwa50s28se4rpg6",
      "balance": "94544557332601005877"
  },
  {
      "address": "erd14ln442jwvr34mgsxq3y5r7fppj9j67xjt38p422g5sqmvldke6hqgdsmd5",
      "balance": "94289007190058456660"
  },
  {
      "address": "erd1n0unrh6ktd0jp6x87pzdh54anfeu3zvxmmh76xrqcqd0m6k6ckhqlj0wmf",
      "balance": "93171402115992507747"
  },
  {
      "address": "erd13lmvrwf6mx74gl6h3vv53dt48d4vwt4p3mxx472lxxp63g4yjuvszkwcme",
      "balance": "93170523200422763049"
  },
  {
      "address": "erd1ms8h5kqvvtnkvcvglygkt4d0lehq7u8hnu4k4qn8xasgwy7wgacq8q0vel",
      "balance": "92596429114197790884"
  },
  {
      "address": "erd1uj00prwkuhckn4mys2a97f6ffz7dg9thd959xhkcxysytm6tf4gqf5ptqt",
      "balance": "92036214566774383489"
  },
  {
      "address": "erd1qqqqqqqqqqqqqpgqa3l2ksqnrv2hft045u0sv5nksd4zfz33s28syfhneu",
      "balance": "89202604961781262320"
  },
  {
      "address": "erd128cpyef33jeur0e5x8rc3da0d9pdtqsqqf5m22gnhfgsut9ah4msutfe2y",
      "balance": "89127702472532454571"
  },
  {
      "address": "erd18qzhuyylpmsqyaaa9q6sfp8mnnk93vmgtnmclmy6dhd6ezdem7wq5dd6q2",
      "balance": "88627327729288532002"
  },
  {
      "address": "erd10pa2uha2mfx72nu9qrdl6v44ckdaajz7kk07eme229ydlqafgmvsq5h3kz",
      "balance": "86821382132604227852"
  },
  {
      "address": "erd1lzc7lv52evjmuk622yczyem4w0qed8lz4pj48c828cxrans8m3mqaqmllz",
      "balance": "86532340253261358319"
  },
  {
      "address": "erd12ataw6elacynv25ae0jlyx3zcsaq4f0qt50330fat3sv874teqys5g36yz",
      "balance": "85088051136465017786"
  },
  {
      "address": "erd1fk58e6lfv9rf9dwpt87l39gesh4y3sgmz4nz4um26jez9s4nsecqwasvt6",
      "balance": "84389863539742204957"
  },
  {
      "address": "erd134l84zadfsylg0s0fxry33ec8wh4qxewwuggrwsj23cl59z9pk6ssv98fq",
      "balance": "82709895897291381471"
  },
  {
      "address": "erd1fjj8npemcduxp6jag4t23edx3q02zdu4xtrxfj5fdpp75md2s4ksvgumzh",
      "balance": "81716524919386134960"
  },
  {
      "address": "erd1n73r05qnn3ey0hp65qaqe92w4tj8mnevefvcktkwvm94f7mt53hsvr35cp",
      "balance": "81098898592384717419"
  },
  {
      "address": "erd1gknc87tke0rcqumetftc7hpdendedgvcg7wyc3vs0sxerj2yh0rqjs2vj3",
      "balance": "80980476434929958412"
  },
  {
      "address": "erd1t4tlghny9l9dtdlv9t52jl2jstxx2a85pntlmdecwgmmn8w642qs8230zz",
      "balance": "80377604124163400248"
  },
  {
      "address": "erd1q4frqadr74klnl97rrtut86kx5ggzghcx4rkf5fa3f0lh5emjvhqqa0w0t",
      "balance": "80003905542134122897"
  },
  {
      "address": "erd13ynwwv7du6mpcractaawualm6sv6ud5measrhlhzls63ht25q0vqetgx95",
      "balance": "80002876845578076893"
  },
  {
      "address": "erd1gld7vfc3fwd47jfk4jypnn89dq07gmycscul8sf8z8z7uwggvz2sf53yzz",
      "balance": "80000006194674494412"
  },
  {
      "address": "erd1dd4025rpgcp3m0gr3ncud5nyegpf30get4kvz2mmy56ykw0srz9sdgwfmf",
      "balance": "79282830417785974485"
  },
  {
      "address": "erd1uzh8w7ndx8pvcszkt0uknq6ucv2fssqyl8hfdr25x64rxmydp33qaps4yw",
      "balance": "78937214333344227785"
  },
  {
      "address": "erd147cpn8ackjrxm73uyyum4ej0vlvrlhvpvqshp8lph3g56tne3sysm3zghk",
      "balance": "78799174101890568038"
  },
  {
      "address": "erd1sfkfu3pq9ghs5g3rufft83me2hat86xuk6340l6hvs4w6wzcp68q7kzlh2",
      "balance": "78623302398957268889"
  },
  {
      "address": "erd1f5y54eaetpj87jgcjlt8q5jyq56h2f943gd5tysumpqxr7gpxndqgf46xl",
      "balance": "77821888756870927926"
  },
  {
      "address": "erd1ysx3jqz5jq4dkmcf2kz4mj6gcnqrgpeyff9wlhe73fe8cw42tgdsky670d",
      "balance": "76451124130453543537"
  },
  {
      "address": "erd1vq05aa70dksnpfvl97gmu6uxqac9mscp87uyvg6c7ju4lly73ceqmqzq5x",
      "balance": "75910966373483748661"
  },
  {
      "address": "erd1sysxp4hhy2qa3ftwkqmxhlgmfgxdeapgu0h5xhs3pwflaqw8wfwquz4dnu",
      "balance": "74737758565633950474"
  },
  {
      "address": "erd1qhmpw5dtxmslw4tdlsuy9gcdny3aj2a8t63838yn5l9f8rlrtvcsym7d30",
      "balance": "73534595477291106835"
  },
  {
      "address": "erd10p64r49ueqx6evt8gn6g0ktwftetrgxyqgaud5x85tjq74w6z4xq8thgkr",
      "balance": "73171640037704052997"
  },
  {
      "address": "erd1fwnx36ax29jrhn8dk4gcext8kkgf7f7h5fxy2wnr7jux50nj578qlcxe8t",
      "balance": "73046759672584077771"
  },
  {
      "address": "erd1taszar3yxpulk0umdj9ytf7mygd0d493t5h0qjtpdnqm0pum8uysh99jq0",
      "balance": "72779877548345099285"
  },
  {
      "address": "erd1aypa9ax8ahlrj3nrwh6zls03k702vaqv3wd2nhffajfa58s3wtqsm4n900",
      "balance": "72103931508765567129"
  },
  {
      "address": "erd1hrjuuvjzwzcf48z5f0r46n97nmcater4r5t4mwed8lny3w6vdcvqvfsmem",
      "balance": "71730268954978932700"
  },
  {
      "address": "erd1nwchp0lecekdguhazf696lkftk8r6ghpkz9uvqcrdwkge4dztuvq50mj73",
      "balance": "71609352430228925045"
  },
  {
      "address": "erd13drf64h3hl5mcmpp0exax3ze5yuwf5ka6q86zan95qt6vrdf38dqpyzk5g",
      "balance": "71323986732602746446"
  },
  {
      "address": "erd1vgqul6t4em8zkjhsuwqtwagprsu6agxkrcp0ml6z08qrgwuvr4tsr7c4mj",
      "balance": "71200788108112352002"
  },
  {
      "address": "erd1yww890rrypnlhe9c7vkugp5v42f8lq55ycmejx8rzu0lfa98cu5syxclgw",
      "balance": "70878089971361438774"
  },
  {
      "address": "erd12zf4cw66gaygtp2s7k8qkz972hw7nzuflvxvyrvd69v4r5nywawqs9yucc",
      "balance": "70599102991900581163"
  },
  {
      "address": "erd1dfl4g9l9x0unzu3nmy0aamhpvjf2dct589zscqrhmn2qz9tqjwasuyufxc",
      "balance": "70153216956582725757"
  },
  {
      "address": "erd1l6hka5d2eyek0ue8j0khvsnt59fe0wvcwt0a2qkvmmpx544py7rq6f4ae4",
      "balance": "70055069826544041574"
  },
  {
      "address": "erd1yca5ehtws03w5huap2l55yly967jxp7hy3uwgzz3ssjae3w42clqllynxz",
      "balance": "69773617534425099408"
  },
  {
      "address": "erd1acut9huw360agf4zzmltnvymrge67u6d90ntavsx3fff3ltkezksvdzgw8",
      "balance": "69522525792703064663"
  },
  {
      "address": "erd1wtm3yl58vcnj089lqy3tatkdpwklffh4pjnf27zwsa2znjyk355sutafqh",
      "balance": "69497923215534082595"
  },
  {
      "address": "erd1yylek64rlnuwytmnp9xhcxkrn2ufgc7lkaj6sz905td6a3rhd5vqhfh74w",
      "balance": "69359819988010688064"
  },
  {
      "address": "erd1rlaf0jv7hquknhejyv97t2hnf9xku2s5h9y43katg0payr5gty6syu0kyx",
      "balance": "68833800718383487655"
  },
  {
      "address": "erd1p9ujjfzq9f6pca5l4rvtphzjgrneamntzxyx0xwza7wn7kv8kzes5356j9",
      "balance": "68736292763935922176"
  },
  {
      "address": "erd10gjdcnd3dqws348edemr9sxvqfltw6l0v7tst3kspn86u9kxktyskqgptj",
      "balance": "68329546054667007839"
  },
  {
      "address": "erd1kxrvcc24s8mcv8wpl23gvjk265thydeyecx3deraukxfha8rrvnswud92s",
      "balance": "68115476189543157897"
  },
  {
      "address": "erd1swwwdswj2k5vkw9n65h873w7txr2vx9ylgp4vaexh0r7u2laqy0qp8mwae",
      "balance": "68000000000000000000"
  },
  {
      "address": "erd1zvqekvl29d3pgk2hz0sga09p20p4tdr5z92fmuhpmqgkkkqf5g0s77gmut",
      "balance": "67239271324029907901"
  },
  {
      "address": "erd1ge7j2h3gyn4cadv4sucrggq27hz34c7hvu8ffad50rj6glzva4rsk9nx2n",
      "balance": "66775901204700680804"
  },
  {
      "address": "erd12kugw57uk07kzd3mjeyjhv8t9vjkffsfdlfrsjpfra77m7lcxq9q49uaeh",
      "balance": "66626646556468842482"
  },
  {
      "address": "erd1w9hn8e92srtyfcqeuredq9nzht2fg3pf5vk39tqacnfhl7up3knswl2xd3",
      "balance": "66477941215757361580"
  },
  {
      "address": "erd1kq5hzjnx9ca9593jxk9948wlseqndda26l7zp603edlty85r52yqnj5sra",
      "balance": "66383689911775803648"
  },
  {
      "address": "erd1gqqgefnn7vpcxp0nucrstlhsvk54cp9en4a4quhualkvys70xkyst5tvxu",
      "balance": "65209351028537654365"
  },
  {
      "address": "erd16l5xmjjxhstu02g6vk24ej3p64y6mnypd5e5mectuahpueq5r9rsqh3npx",
      "balance": "65162332365656559187"
  },
  {
      "address": "erd19ug0cuuhngs6x0nxxeg4ljttqk2eu4mnkje9f02tdxg4a3v76waqfg4yx9",
      "balance": "65098760027569651735"
  },
  {
      "address": "erd1h54lzrwcx8nx08hyr3d6tmzfzrwrny423rcy48g9vejjgm5xg9yqa6ynew",
      "balance": "64586206326411758218"
  },
  {
      "address": "erd1me5hmqt5qg9r9jgw9r936444va6f4qw4uf0y2sgk0hsfhmtwvhnscdu9us",
      "balance": "64212252316769148037"
  },
  {
      "address": "erd1sznw9zu8q2tex8tv8gm3afekpfva5frs3lql49q5vvwhqeq4jnjsg3kyl6",
      "balance": "64112620857946095726"
  },
  {
      "address": "erd1dwglc80sedlk85uhhpl3xm0hpgfhenz2h8kwsdmdufnv7w63x3jqf0y4w0",
      "balance": "63689616885789930344"
  },
  {
      "address": "erd160kcwjl3g8nnax7a88vxgnrswgwaswhtn5hpyq7k2dw5xr5rapzqv8t90h",
      "balance": "63031962951326169781"
  },
  {
      "address": "erd18mpndk7awydmkmdgca2zuvlqxcfkr0szkqyrdgr9rx9u5gqapulse7eg8u",
      "balance": "63015226094222160308"
  },
  {
      "address": "erd1eurw4w6v6h2eqp86mvv3wndfsngtpca4u0nm9ynl22w7958fjujq7jh0td",
      "balance": "61021237964344169169"
  },
  {
      "address": "erd1kgn7773ge5pnz6g6jvmdlyfa4582j2rv6rqzxsegfn4cs2mfeltq35tqm4",
      "balance": "60254775301804852728"
  },
  {
      "address": "erd1zm7s0h0jnkyqeuqvpjzfujfwe0vmv2djqhf7u0v8v3qtd5a8vcmqajk0q0",
      "balance": "60085293868741037062"
  },
  {
      "address": "erd1rgdzdj2h40cp0vgyjczccahy8klaa3r4wqdz4lfpqklk802f9dnq6t9swl",
      "balance": "60069620516888397310"
  },
  {
      "address": "erd1yfm9le22dr6uxm7gy5uurjehsxu7v6a2fm69akaxxz9lcx2l2g0sd7w6kh",
      "balance": "59854202950362186793"
  },
  {
      "address": "erd1ps7y7y5jqvjnphksku9m0qven9sqqvrmr2q0uly8z3tfxma8dt0q4usxfp",
      "balance": "59712465067697434373"
  },
  {
      "address": "erd195g7t6xwdfcnu6tvye4ks3r09sluzfxhaa7wrd9edqcfu9r645eq8x53v6",
      "balance": "59631417611025570148"
  },
  {
      "address": "erd132mms9aymdrtwhm7t422t286u4fgpnwkwh6teevlt8050ra9h5nqxh4y0x",
      "balance": "57747289245828905808"
  },
  {
      "address": "erd14lgm6ftdj50anfur8lq3ajc9w0jy0jgxc6vvx2nz477y0kuk896qux3nt5",
      "balance": "56486073809228173705"
  },
  {
      "address": "erd1ujqjquft4lhmrvm4wexd3ggekeq8exqdsk0j6wmlruct5u57k3ws5uhn5j",
      "balance": "56472829810791910659"
  },
  {
      "address": "erd1eypl6rph33vkew2h3fg8ummg4t0unealyca3dpttmf04zcauq8zqtgnqcg",
      "balance": "56468624679318934719"
  },
  {
      "address": "erd14z50ecwypvutm2a8387yxnyzzj6ukyqaxth4pfru2v4m63me9qdq2gre83",
      "balance": "56466235242079728897"
  },
  {
      "address": "erd10knvaup2smh5h63a6n8smynsny6ka404pt3chrqf64ugllcuwy2qtt6x9v",
      "balance": "56206738215721262868"
  }
];

ChartJS.register(
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const maxScaleSize = 800;
const chartOptions = {
  aspectRatio: 1,
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (ctx: any) => {
          console.log(ctx);
          return `${shortenAddress(ctx.dataset.label)} (${ctx.dataset.percent.toFixed(4)}%)`;
        },
      }
    }
  },
  scales: {
    x: {
      max: maxScaleSize,
      min: -maxScaleSize,
      display: false,
    },
    y: {
      max: maxScaleSize,
      min: -maxScaleSize,
      display: false,
    },
  },
};

let sum = new BigNumber(0);
rawData.forEach(row => sum = sum.plus(row['balance']));

const accounts = rawData.map(row => {
  const percent = new BigNumber(row['balance']).div(sum).toNumber() * 100;
  let backgroundColor = '#fff';
  if (percent > 1) {
    backgroundColor = '#f00';
  } else if (percent > 0.1) {
    backgroundColor = '#0f0';
  } else if (percent > 0.01) {
    backgroundColor = '#00f';
  }

  return {
    address: row['address'],
    percent,
    backgroundColor,
  };
});
console.log('accounts', accounts);

const stepAngle = 0.4;

const dummyData = {
  datasets: accounts.map((acc, i) => {
    // const angle = i < 10 ? 0.5 * i : 0.4 * i;
    const angle = 0.4 * i;
    // const distance = (60 + Math.pow(i * 500, 0.45) * 2);
    const distance = (100 + Math.pow(i * 2000, 0.45) + Math.pow(1.01, i) * 20);
    const pos = pointRadial(angle, distance);
    return {
      label: acc.address,
      data: [{
        x: pos[0],
        y: pos[1],
        r: Math.pow(acc.percent * 1500, 0.16) * 2,
      }],
      backgroundColor: acc.backgroundColor,
      percent: acc.percent,
    };
  }),
};

export const EsdtBubble = () => {
  const {
    network: { explorerAddress },
  } = useGetNetworkConfig();
  const { address } = useGetAccount();
  const { hasPendingTransactions } = useGetPendingTransactions();

  const [dataNfts, setDataNfts] = useState<DataNft[]>([]);
  const [flags, setFlags] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNftLoading, setIsNftLoading] = useState(false);

  const [dataMarshalRes, setDataMarshalRes] = useState<string>("");
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] =
    useState<boolean>(true);
  const [owned, setOwned] = useState<boolean>(false);

  const [data, setData] = useState<any>();
  const [dataItmes, setDataItmes] = useState<any[]>([]);

  const [isModalOpened, setIsModalOpenend] = useState<boolean>(false);
  function openModal() {
    setIsModalOpenend(true);
  }
  function closeModal() {
    setIsModalOpenend(false);
  }

  async function fetchDataNfts() {
    setIsLoading(true);

    const _nfts: DataNft[] = await DataNft.createManyFromApi(
      ESDT_BUBBLE_NONCES
    );
    console.log("ESDT Bubble NFTs:", _nfts);
    setDataNfts(_nfts);

    setIsLoading(false);
  }

  async function fetchMyNfts() {
    setIsNftLoading(true);

    const _dataNfts = await DataNft.ownedByAddress(address);
    console.log("myDataNfts", _dataNfts);

    const _flags = [];
    for (const cnft of dataNfts) {
      const matches = _dataNfts.filter((mnft) => cnft.nonce === mnft.nonce);
      _flags.push(matches.length > 0);
    }
    console.log("_flags", _flags);
    setFlags(_flags);

    setIsNftLoading(false);
  }

  useEffect(() => {
    if (!hasPendingTransactions) {
      fetchDataNfts();
    }
  }, [hasPendingTransactions]);

  useEffect(() => {
    if (!isLoading && address) {
      fetchMyNfts();
    }
  }, [isLoading, address]);

  async function viewData(index: number) {
    if (!(index >= 0 && index < dataNfts.length)) {
      toastError("Data is not loaded");
      return;
    }

    const _owned = flags[index];
    setOwned(_owned);

    if (_owned) {
      setIsFetchingDataMarshal(true);
      setDataMarshalRes("");
      openModal();

      const dataNft = dataNfts[index];
      const messageToBeSigned = await dataNft.getMessageToSign();
      console.log("messageToBeSigned", messageToBeSigned);
      const signedMessage = await signMessage({ message: messageToBeSigned });
      console.log("signedMessage", signedMessage);
      const res = await dataNft.viewData(
        messageToBeSigned,
        signedMessage as any as SignableMessage
      );
      console.log("viewData", res);
      setDataMarshalRes(JSON.stringify(res, null, 4));

      const items = res;

      const datasets = [];
      for (let i = 0; i < EB_SHOW_SIZE; i++) {
        if (i + 1 >= items.length) break;
        const item = items[i];
        datasets.push({
          label: item.address,
          data: {

          },
          backgroundColor: BACKGROUND_COLORS[i % BACKGROUND_COLORS.length],
        });
      }
      setDataItmes(items);

      const _data = {
        labels: ["Kills", "Deaths", "Wins", "Losses"],
        datasets,
      };
      setData(_data);

      setIsFetchingDataMarshal(false);
    } else {
      openModal();
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="d-flex flex-fill justify-content-center container py-4">
      <div className="row w-100">
        <div className="col-12 mx-auto">
          <h4 className="mt-5 text-center">
            ESDT Bubble NFTs: {dataNfts.length}
          </h4>

          <Bubble options={chartOptions} data={dummyData} />
          <div className="d-flex justify-content-center">
            <div className="d-flex flex-row align-items-center">
              <div className="d-flex justify-content-center align-items-center p-2">
                <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }}>
                  <circle cx=".5rem" cy=".5rem" r=".5rem" fill="#f00" />
                </svg>
                <span>{'> 1%'}</span>
              </div>
              <div className="d-flex justify-content-center align-items-center p-2">
                <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }}>
                  <circle cx=".5rem" cy=".5rem" r=".5rem" fill="#0f0" />
                </svg>
                <span>{'> 0.1%'}</span>
              </div>
              <div className="d-flex justify-content-center align-items-center p-2">
                <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }}>
                  <circle cx=".5rem" cy=".5rem" r=".5rem" fill="#00f" />
                </svg>
                <span>{'> 0.01%'}</span>
              </div>
            </div>
          </div>

          <div className="row mt-5">
            {dataNfts.length > 0 ? (
              dataNfts.map((dataNft, index) => {
                return (
                  <div
                    className="col-12 col-md-6 col-lg-4 mb-3 d-flex justify-content-center"
                    key={`o-c-${index}`}
                  >
                    <div className="card shadow-sm border">
                      <div className="card-body p-3">
                        <div className="mb-4">
                          <img
                            className="data-nft-image"
                            src={
                              !isLoading
                                ? dataNft.nftImgUrl
                                : "https://media.elrond.com/nfts/thumbnail/default.png"
                            }
                          />
                        </div>

                        <div className="mt-4 mb-1">
                          <h5 className="text-center text-info">
                            Data NFT Info
                          </h5>
                        </div>
                        <div className="mb-1 row">
                          <span className="col-4 opacity-6">Title:</span>
                          <span className="col-8">{dataNft.title}</span>
                        </div>
                        <div className="mb-1 row">
                          <span className="col-4 opacity-6">Description:</span>
                          <span className="col-8">
                            {dataNft.description.length > 20
                              ? dataNft.description.slice(0, 20) + " ..."
                              : dataNft.description}
                          </span>
                        </div>
                        <div className="mb-1 row">
                          <span className="col-4 opacity-6">Creator:</span>
                          <span className="col-8 cs-creator-link">
                            {
                              <ElrondAddressLink
                                explorerAddress={explorerAddress}
                                address={dataNft.creator}
                                precision={6}
                              />
                            }
                          </span>
                        </div>
                        <div className="mb-1 row">
                          <span className="col-4 opacity-6">Created At:</span>
                          <span className="col-8">
                            {dataNft.creationTime.toLocaleString()}
                          </span>
                        </div>

                        <div className="mb-1 row">
                          <span className="col-4 opacity-6">Identifier:</span>
                          <span className="col-8">
                            {dataNft.tokenIdentifier}
                          </span>
                        </div>
                        <div className="mb-1 row">
                          <span className="col-4 opacity-6">Supply:</span>
                          <span className="col-8">{dataNft.supply}</span>
                        </div>
                        <div className="mb-1 row">
                          <span className="col-4 opacity-6">Royalties:</span>
                          <span className="col-8">
                            {dataNft.royalties + "%"}
                          </span>
                        </div>

                        <div className="mt-3 text-center">
                          {flags[index] ? (
                            <h6 className="font-title font-weight-bold">
                              You have this Data NFT
                            </h6>
                          ) : (
                            <h6 className="font-title font-weight-bold opacity-6">
                              You do not have this Data NFT
                            </h6>
                          )}
                        </div>

                        <div className="mt-4 mb-1 d-flex justify-content-center">
                          <button
                            className="btn btn-primary"
                            onClick={() => viewData(index)}
                          >
                            View Data
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <h3 className="text-center text-white">No DataNFT</h3>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpened}
        onRequestClose={closeModal}
        style={modalStyles}
        ariaHideApp={false}
      >
        <div style={{ height: "3rem" }}>
          <div
            style={{
              float: "right",
              cursor: "pointer",
              fontSize: "2rem",
            }}
            onClick={closeModal}
          >
            <IoClose />
          </div>
        </div>
        <ModalHeader>
          <h4 className="text-center font-title font-weight-bold">View Data</h4>
        </ModalHeader>
        <ModalBody>
          {!owned ? (
            <div
              className="d-flex flex-column align-items-center justify-content-center"
              style={{
                minWidth: "24rem",
                maxWidth: "50vw",
                minHeight: "40rem",
                maxHeight: "80vh",
              }}
            >
              <img
                src={imgBlurChart}
                style={{ width: "24rem", height: "auto" }}
              />
              <h4 className="mt-3 font-title">You do not own this Data NFT</h4>
              <h6>
                (Buy the Data NFT from marketplace if you want to see data)
              </h6>
            </div>
          ) : isFetchingDataMarshal || !data ? (
            <div
              className="d-flex flex-column align-items-center justify-content-center"
              style={{
                minWidth: "24rem",
                maxWidth: "50vw",
                minHeight: "40rem",
                maxHeight: "80vh",
              }}
            >
              <Loader />
            </div>
          ) : (
            <div
              style={{
                minWidth: "26rem",
                maxWidth: "50vw",
                minHeight: "36rem",
                maxHeight: "60vh",
                overflowY: "auto",
                // backgroundColor: "#f6f8fa",
              }}
            >
              <h5 className="mt-3 mb-4 text-center font-title font-weight-bold">
                TOP {EB_SHOW_SIZE} Accounts
              </h5>
              <Bubble options={chartOptions} data={data} />
              {/* <p className='p-2' style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{dataMarshalRes}</p> */}
              {/* <Table striped responsive className="mt-3">
                <thead>
                  <tr className="bg-info">
                    <th>#</th>
                    <th>Nickname</th>
                    <th>Rank</th>
                    <th>Kills</th>
                    <th>Deaths</th>
                    <th>Wins</th>
                    <th>Losses</th>
                  </tr>
                </thead>
                <tbody>
                  {players
                    .slice(0, CC_SHOW_SIZE)
                    .map((player: any, index: number) => (
                      <tr key={`c-c-p-${index}`}>
                        <td>{index + 1}</td>
                        <td>{player.nickname}</td>
                        <td>{player.rank}</td>
                        <td>{player.kills}</td>
                        <td>{player.deaths}</td>
                        <td>{player.wins}</td>
                        <td>{player.losses}</td>
                      </tr>
                    ))}
                </tbody>
              </Table> */}
            </div>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};
