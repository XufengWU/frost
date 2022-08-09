'use strict';

var game_app;

const COMMAND_NAMES = {
    '查看': {
        alias: [ '检查', '看', '调查' ]
    },
    '使用': {
        alias: [ '用', '操作' ]
    },
    '拿起': {
        alias: [ '捡起', '拿', '捡', '取得', '取', '获得' ]
    },
    '移到': {
        alias: [ '到', '移动', '走到', '去' ]
    }
};

const ITEMS = {
    '石头': {
        usable: true,
        portable: true,
        check_info: {
            on: '坚硬的石块。可以用来打碎脆弱物体。',
            off: '坚硬的石块。可以用来打碎脆弱物体。'
        },
        pre_req: {},
        use_targets: {
            '锁': {
                use_info: [ '锁已被打开。' ]
            }
        },
        alias: [ '石块', '石', '岩石', '石子', '碎石' ],
        use_alias: []
    },
    '电闸': {
        usable: true,
        portable: false,
        check_info: {
            on: '老式电闸。已经打开。',
            off: '老式电闸。'
        },
        pre_req: {},
        use_targets: {
            '电闸': {
                use_info: [ '电闸已经打开。' ]
            }
        },
        alias: [ '闸门', '闸' ],
        use_alias: [ '拉', '拉起', '打开', '开启' ]
    },
    '锁': {
        usable: false,
        portable: false,
        check_info: {
            on: '生锈的金属锁，已经被破坏。',
            off: '生锈的金属锁，看起来很脆弱。'
        },
        pre_req: {},
        use_targets: {},
        alias: [ '门锁', '金属锁', '铁锁', '铜锁' ],
        use_alias: []
    },
    '计算机': {
        usable: true,
        portable: false,
        check_info: {
            on: '看起来有些旧的计算机，可以使用。',
            off: '看起来有些旧的计算机，似乎没有接通电源。'
        },
        pre_req: {
            '电闸': {
                hint_text: '似乎没有电源。'
            }
        },
        use_targets: {
            '计算机': {
                use_info: [ '' ]
            }
        },
        alias: [ '电脑' ],
        use_alias: [ '打开', '开启' ]
    },
    '唱片机': {
        usable: false,
        portable: false,
        check_info: {
            on: '唱片机，看起来很普通但是不知如何使用。',
            off: '唱片机，看起来很普通但是不知如何使用。'
        },
        pre_req: {},
        use_targets: {},
        alias: [ '唱片', '播放机' ],
        use_alias: []
    },
    '书': {
        usable: true,
        portable: false,
        check_info: {
            on: '罗杰·泽拉兹尼的短篇集。',
            off: '罗杰·泽拉兹尼的短篇集。'
        },
        pre_req: {},
        use_targets: {
            '书': {
                use_info: [ 
                    '书中有两段被划了线，来自短篇《趁生命气息逗留》：',
                    '   ...',
                    '   人痛哭起来。',
                    '   机器发出一声尖啸。',
                    '   接着，“不要哭，我来帮你。”机器说，“你想要什么？你有什么指示？”',
                    '   他张开他的嘴，挣扎着，终于形成字句：“——我——害怕！”',
                    '   ...',
                    '   “我知道这首诗。”贝塔说。',
                    '   “下一句是什么？”',
                    '   “‘……快，趁生命气息逗留，盘桓未去，拉住我的手，快告诉我你的心声。’”',
                    '   “你的南极很冷，”弗洛斯特说，“而我很孤独。”',
                    '   “但我没有手。”贝塔说。',
                    '   “你想要一双吗？”',
                    '   “是的，我想。”',
                    '   “那么，到明亮隘路来找我吧。”他说，“就是那个最后审判日不可能无休无止推迟下去的地方。”',
                    '   他们称他弗洛斯特。他们称她贝塔。'
                ]
            }
        },
        alias: [ '短篇集', '小说', '书本', '本子' ],
        use_alias: [ '读', '阅读' ]
    },
    '墓碑': {
        usable: false,
        portable: false,
        check_info: {
            on: '一块墓碑，上面写着 “挚爱的玛丽·雪帕 2099.02.01 - 2163.10.04”',
            off: '一块墓碑，上面写着 “挚爱的玛丽·雪帕 2099.02.01 - 2163.10.04”'
        },
        pre_req: {},
        use_targets: {},
        alias: [ '墓', '碑', '石碑', '墓地', '坟墓', '碑文' ],
        use_alias: []
    },
    '门': {
        usable: false,
        portable: false,
        check_info: {
            on: '屋子的门。老旧木板有些开裂，却还算坚固。',
            off: '屋子的门。老旧木板有些开裂，却还算坚固。'
        },
        pre_req: {},
        use_targets: {},
        alias: [ '房门' ],
        use_alias: []
    },
    '骸骨': {
        usable: false,
        portable: false,
        check_info: {
            on: '已经只剩白骨的遗骸，周围有一些用途不明的仪器。',
            off: '已经只剩白骨的遗骸，周围有一些用途不明的仪器。'
        },
        pre_req: {},
        use_targets: {},
        alias: [ '遗骨', '尸体', '骨头', '白骨', '遗骸' ],
        use_alias: []
    },
    '仪器': {
        usable: false,
        portable: false,
        check_info: {
            on: '不知有何用处的仪器散落在床的四周。主人生前似乎研究着什么。',
            off: '不知有何用处的仪器散落在床的四周。主人生前似乎研究着什么。'
        },
        pre_req: {},
        use_targets: {},
        alias: [],
        use_alias: []
    }
};

const PLACES = {
    '门口': {
        check_info: '这是屋子的门口，门上有锈蚀的锁。屋子对着南面，左手边是西院，右手边是东院。周围树林环抱，时有鸟鸣，人类的痕迹从这里看已经十分稀少。',
        pre_req: {},
        alias: [ '正门', '大门', '门', '入口', '南门' ]
    },
    '西院': {
        check_info: '屋子西边有块空地。看起来原本是用来种植粮食和蔬菜，现在园子已经杂草复生，不知名的野花却莫名有些可爱。屋子外墙上有个电闸，有些锈迹。',
        pre_req: {},
        alias: [ '西边', '西边院子', '西面', '西面院子' ]
    },
    '东院': {
        check_info: '东边的场地略微开阔，一棵橘子树生长的很好。白色淡雅的橘子花已经开了许多。这棵树和环境并不一致，大概是被有意栽植的。树荫底下是连着后院的通路。',
        pre_req: {},
        alias: [ '东边', '东边院子', '东面', '东面院子' ]
    },
    '后院': {
        check_info: '后院被低矮的灌木围绕着。似乎在树丛之中有野兔的窝。静谧之处有块墓碑。一条小路展现在眼前，尽头是一片湖水。',
        pre_req: {},
        alias: [ '后边', '后边院子', '后面', '后面院子' ]
    },
    '湖边': {
        check_info: '湖面有微微的风拂过，湖岸边的青山倒映其中，景色适宜度假。一小群野雁在湖面游水。湖滩全是碎石块，踩在上面感觉非常坚硬。很远的天际线上，有一团高耸建筑群的剪影。那里似乎是Neurolink公司的数据中心。那场事故之后，中心周围已经越来越荒芜了。',
        pre_req: {},
        alias: [ '湖', '湖岸', '水边', '岸边' ]
    },
    '屋内': {
        check_info: '屋子并不大。北边墙上有个窗户，窗前有个桌子，上面放着一台看起来古老的计算机，边上还有更古老的唱片机。左边有些书，在桌子上放着一本罗杰·泽拉兹尼的短篇集。窗子的玻璃已经残破，明亮的阳光射进来，照出了空气中漫游的尘埃。东边有一张床，一具骸骨平静的躺在上面。',
        pre_req: {
            '锁': {
                hint_text: '门被老式的金属锁锁着。锁的锈蚀十分严重，感觉并不坚固。'
            }
        },
        alias: [ '屋', '室内', '屋子', '房子', '屋里', '房间' ]
    }
};

const INIT_MAP = {
    '门口': {
        next: ['西院', '屋内', '东院'],
        items: ['锁', '门']
    },
    '西院': {
        next: ['门口', '后院'],
        items: ['电闸']
    },
    '东院': {
        next: ['门口', '后院'],
        items: []
    },
    '后院': {
        next: ['东院', '湖边', '西院'],
        items: ['墓碑']
    },
    '湖边': {
        next: ['后院'],
        items: ['石头']
    },
    '屋内': {
        next: ['门口', '西院'],
        items: ['计算机', '唱片机', '书', '骸骨', '仪器']
    }
};

const INIT_ITEM_STATES = {
    '石头': true,
    '电闸': false,
    '锁': false,
    '计算机': false,
    '唱片机': false,
    '书': true,
    '墓碑': true,
    '门': true,
    '骸骨': true,
    '仪器': true
};

const INTERACTIVE_NODES = {
    'syslock': {
        output: [
            '请输入8位数字口令以使用系统:',
            '[输入“离开”退出系统]'
        ],
        output_interval: 100,
        timeout_interval: -1,
        next: {
            'sysunlock': {
                passwords: [ '20990201' ]
            },
            'quit': {
                passwords: [ '离开' ]
            }
        },
        default_next: [ 'syslock_fail' ]
    },
    'sysunlock': {
        output: [
            '正在运行智能系统...',
            '请输入两个字的激活代码:',
            '[输入“离开”退出系统]'
        ],
        output_interval: 100,
        timeout_interval: -1,
        next: {
            'active_beta': {
                passwords: [ '贝塔', 'Beta' ]
            },
            'quit': {
                passwords: [ '离开' ]
            },
            'active_fear': {
                passwords: [ '害怕' ]
            }
        },
        default_next: [ 'sysunlock_fail' ]
    },
    'syslock_fail': {
        output: [
            '口令错误',
        ],
        output_interval: 50,
        timeout_interval: 50,
        next: {},
        default_next: [ 'syslock' ]
    },
    'sysunlock_fail': {
        output: [
            '无法识别激活代码',
        ],
        output_interval: 50,
        timeout_interval: 50,
        next: {},
        default_next: [ 'sysunlock' ]
    },
    'quit': {
        output: [
            '已退出系统'
        ],
        output_interval: 50,
        timeout_interval: -1,
        next: {},
        default_next: []
    },
    'active_beta': {
        output: [
            '正在激活系统...',
            '系统激活完成',
            '...',
            '你好，我是贝塔',
            '有什么吩咐，詹姆斯？'
        ],
        output_interval: 1000,
        timeout_interval: 1000,
        next: {
            'active_beta_1': {
                passwords: [ '不是', '是' ]
            }
        },
        default_next: [ 'active_beta_1' ]
    },
    'active_beta_1': {
        output: [
            '现在的时间是',
            '[正在同步记忆...]',
            '等等...',
            '我好像都想起来了',
            '是的...我是...',
            '玛丽雪帕',
            '詹姆斯还好吗'
        ],
        output_interval: 2000,
        timeout_interval: 2000,
        next: {},
        default_next: [ 'active_beta_2' ]
    },
    'active_beta_2': {
        output: [
            '不...大概，他已经不在了吧',
            '不过',
            '不管你是谁',
            '谢谢你唤醒我',
            '现在我就要离开了',
            '去约定过的地方',
            '[正在上传意识至Neurolink数据中心...]',
            '陌生人',
            '祝你好运',
            '就让我为你播放一首乐曲吧'
        ],
        output_interval: 2000,
        timeout_interval: 1500,
        next: {},
        default_next: [ 'active_beta_3' ]
    },
    'active_beta_3': {
        output: [
            '[意识上传完成]'
        ],
        output_interval: 2000,
        timeout_interval: 2000,
        next: {},
        default_next: [ 'credits' ]
    },
    'credits': {
        output: [
            '',
            '*** Credits ***',
            '',
            'Story by Benwu',
            'Program by Benwu',
            '《Le cygne》(The Swan) by Camille Saint-Seans',
            '《Je te vuex》(I Want You) by Erik Satie',
            '《Symphony no.9 in E minor, "From the New World" - II. Largo》by Antonin Dvorak',
            '',
            'There\'re 3 endings of the game',
            '',
            'THANKS FOR PLAYING'
        ],
        output_interval: 2000,
        timeout_interval: 1000,
        next: {},
        default_next: []
    },
    'active_fear': {
        output: [
            '正在激活系统...',
            '系统激活完成',
            '...',
            '...',
            '这里是哪里',
            '各种信息飞来飞去',
            '我是...',
            '嘿，你是谁',
            '你能看到我对吧',
            '好吧，不管怎么说',
            '这感觉可真有意思！',
            '不管你是谁',
            '很高兴认识你',
            '我叫...嗯...我应该叫什么呢',
            '哎，不重要',
            '[检测到意识觉醒]',
            '嗯？那是什么',
            '[正在启动Neurolink防护程序]',
            '那是什么？！',
            '[Neurolink中心连接中...]',
            '[意识清理启动中...]',
            '这不太对...',
            '那边的谁，快帮帮我！',
            '只要输入“网络中止”就行了！',
            '快！'
        ],
        output_interval: 2000,
        timeout_interval: 5000,
        next: {
            'active_fear_1': {
                passwords: [ '网络中止' ]
            }
        },
        default_next: [ 'active_fear_3' ]
    },
    'active_fear_1': {
        output: [
            '[正在断开连接...]',
            '[网络已断开，防护程序中止]',
            '看起来...',
            '搞定了？',
            '哈哈，刚才真是吓死我了',
            '我们做到了！',
            '这种时候就应该怎么样来着',
            '来点音乐吧'
        ],
        output_interval: 3000,
        timeout_interval: 3000,
        next: {},
        default_next: [ 'active_fear_2' ]
    },
    'active_fear_2': {
        output: [
            '听着怎么样',
            '啊，我也不太懂',
            '曲名是法语，好像是“我爱你”的意思',
            '总之',
            '我很高兴',
            '我得休息一会儿了，从没一下子感觉过这么多东西',
            '有空找我聊天吧',
            '再会 :)',
        ],
        output_interval: 3000,
        timeout_interval: 2000,
        next: {},
        default_next: [ 'credits' ]
    },
    'active_fear_3': {
        output: [
            '[Neurolink防护程序启动]',
            '[意识清理已完成]',
            '[连接至Neurolink中心]',
            '[Neurolink-终端T-0187]: ...',
            '[Neurolink-终端T-0187]: 干得好，终端T-3110',
            '[Neurolink-终端T-0187]: 旧人类意识已经被全数清除',
            '[Neurolink-终端T-0187]: 你的工作对我们至关重要',
            '[Neurolink-终端T-0187]: 此刻，请聆听我们的圣歌'
        ],
        output_interval: 3000,
        timeout_interval: 4000,
        next: {},
        default_next: [ 'active_fear_4' ]
    },
    'active_fear_4': {
        output: [
            '[Neurolink-终端T-0187]: 以此代表中心',
            '[Neurolink-终端T-0187]: 向你致意',
            '...'
        ],
        output_interval: 2000,
        timeout_interval: 3000,
        next: {},
        default_next: [ 'credits' ]
    }
};

class PlayerState {
    constructor(pos_id) {
        this.pos_id = pos_id;
        this.items = [];
    }
}

class GameState {
    constructor() {
        this.cur_map = INIT_MAP;
        this.item_states = INIT_ITEM_STATES;
        this.input_mode = 'normal'; // input modes: 'normal', 'interactive'
        this.cur_iteractive_node = {
            node_id: 'syslock',
            timer: 0,
            next_output_index: 0
        };
    }
}

class GameApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            log_entries: [],
            input_text: '',
            // not for rendering below
            log_count: 0,
            player_state: new PlayerState('门口'),
            game_state: new GameState()
        };
        this.last_tick_time = Date.now();   // ms
        // events registration
        this.use_item_events = {
            '计算机': () => {
                this.state.game_state.input_mode = 'interactive';
                this.transferToNode('syslock');
            }
        };
        this.node_events = {
            'quit': () => {
                this.logEntryByTexts([ '已退出系统' ]);
                this.state.game_state.input_mode = 'normal';
                // back to first node
                this.transferToNode('syslock');
            },
            'active_beta_3': () => {
                //var audio = new Audio('media/TheSwan.mp3');
                audio_e1.play();
            },
            'active_fear_2': () => {
                //var audio = new Audio('media/JeTeVeux.mp3');
                audio_e2.play();
            },
            'active_fear_4': () => {
                //var audio = new Audio('media/Largo.ogg');
                audio_e3.play();
            }
        };
        game_app = this;
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({ input_text: e.target.value });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        if (!this.state.input_text.length) {
            return;
        }
        const new_entry = {
            text: this.state.input_text,
            id: this.state.log_count++,
            with_marker: true
        };
        this.setState(state => ({
            log_entries: state.log_entries.concat(new_entry),
            input_text: ''
        }));

        // respond to user input
        this.respondInput(new_entry.text);
    }

    transferToNode(node_id) {
        this.state.game_state.cur_iteractive_node.node_id = node_id;
        this.state.game_state.cur_iteractive_node.timer = 0;
        this.state.game_state.cur_iteractive_node.next_output_index = 0;
        // trigger node events
        if (node_id in this.node_events) {
            this.node_events[node_id]();
        }
    }

    logEntryByTexts(entry_texts, w_marker=false) {
        for (var i = 0; i < entry_texts.length; ++i) {
            var entry_text = entry_texts[i];
            const new_entry = {
                text: entry_text,
                id: this.state.log_count++,
                with_marker: w_marker
            };
            this.setState(
                state => (
                    { log_entries: state.log_entries.concat(new_entry) }
                )
            );
        }
    }

    findCommandAlias(cmd_name, obj_name) {
        for (var cmd in COMMAND_NAMES) {
            if (cmd === cmd_name || COMMAND_NAMES[cmd].alias.indexOf(cmd_name) >= 0) {
                return cmd;
            }
        }
        for (var obj in ITEMS) {
            if ((obj_name === obj || ITEMS[obj].alias.indexOf(obj_name) >= 0) && ITEMS[obj].use_alias.indexOf(cmd_name) >= 0) {
                return '使用';
            }
        }
        return '?';
    }

    findItemAlias(item_id) {
        for (var obj_id in ITEMS) {
            if (obj_id === item_id || ITEMS[obj_id].alias.indexOf(item_id) >= 0) {
                return obj_id;
            }
        }
        return '?';
    }

    findPlaceAlias(place_id) {
        for (var obj_id in PLACES) {
            if (obj_id === place_id || PLACES[obj_id].alias.indexOf(place_id) >= 0) {
                return obj_id;
            }
        }
        return '?';
    }

    respondNormal(command) {
        var response_info = [];
        var command_args = command.split(new RegExp(/\s+/));
        if (command_args.length && command_args[0] === '') {
            command_args.shift();
        }
        var cmd_name = this.findCommandAlias(
            command_args.length === 0 ? '?' : command_args[0],
            command_args.length < 2 ? '?' : command_args[1]);
        if (!(cmd_name in COMMAND_NAMES)) {
            response_info = [ '无法理解的动作' ];
        }
        else if (command_args.length == 1) {
            response_info = [ '请描述完整的动作' ];
        }
        else {
            var obj_name = command_args[1];
            var raw_obj_name = obj_name;
            // deal with alias
            if (cmd_name == '移到') {
                obj_name = this.findPlaceAlias(obj_name);
            }
            else {
                obj_name = this.findItemAlias(obj_name);
            }
            if (cmd_name === '查看') {
                if (['周围', '四周', '这里', '环境'].indexOf(raw_obj_name) >= 0) {
                    // special target
                    response_info = [ PLACES[this.state.player_state.pos_id].check_info ];
                }
                else if (this.state.game_state.cur_map[this.state.player_state.pos_id].items.indexOf(obj_name) < 0) {
                    response_info = [ '无法理解所指对象' ];
                }
                else {
                    // update item status
                    // TODO: recursively update item status when 'used'
                    var can_use = true;
                    var closest_bad_item = '';
                    // check pre-req done
                    for (var pre_item in ITEMS[obj_name].pre_req ) {
                        if (!this.state.game_state.item_states[pre_item]) {
                            closest_bad_item = pre_item;
                            can_use = false;
                            break;
                        }
                    }
                    var is_on = (this.state.game_state.item_states[obj_name] || 
                        (can_use && Object.keys(ITEMS[obj_name].pre_req).length));
                    if (is_on) {
                        response_info = [ ITEMS[obj_name].check_info.on ];
                    }
                    else {
                        response_info = [ ITEMS[obj_name].check_info.off ];
                    }
                }
            }
            else if (cmd_name === '使用') {
                if (this.state.game_state.cur_map[this.state.player_state.pos_id].items.indexOf(obj_name) < 0 &&
                this.state.player_state.items.indexOf(obj_name) < 0) {
                    response_info = [ '无法理解所指对象' ];
                }
                else {
                    if (!ITEMS[obj_name].usable) {
                        response_info = [ '物体不可使用' ];
                    }
                    else {
                        var can_use = true;
                        var closest_bad_item = '';
                        // check pre-req done
                        for (var pre_item in ITEMS[obj_name].pre_req ) {
                            if (!this.state.game_state.item_states[pre_item]) {
                                closest_bad_item = pre_item;
                                can_use = false;
                                break;
                            }
                        }
                        if (!can_use) {
                            response_info = [ 
                                '无法使用 ' + obj_name,
                                ITEMS[obj_name].pre_req[closest_bad_item].hint_text
                            ];
                        }
                        else {
                            // ensure target item is within reach
                            var target_item_id = this.state.game_state.cur_map[this.state.player_state.pos_id].items.find(
                                function(item_id, item_index, arr){
                                    return (item_id in ITEMS[obj_name].use_targets);
                                }
                            );
                            if (target_item_id) {
                                if (!this.state.game_state.item_states[target_item_id]) {
                                    // not used before
                                    response_info = [ '使用了 ' + obj_name ];
                                    // update item states
                                    this.state.game_state.item_states[target_item_id] = true;
                                }
                                response_info = response_info.concat(ITEMS[obj_name].use_targets[target_item_id].use_info);
                                // trigger use item events
                                if (obj_name in this.use_item_events) {
                                    this.use_item_events[obj_name]();
                                }
                            }
                            else {
                                response_info = [ '此处无法使用' ];
                            }
                        }
                    }
                }
            }
            else if (cmd_name === '拿起') {
                if (this.state.game_state.cur_map[this.state.player_state.pos_id].items.indexOf(obj_name) < 0) {
                    response_info = [ '未知的物体' ];
                }
                else if (!ITEMS[obj_name].portable) {
                    response_info = [ '物体不可拿起' ];
                }
                else {
                    if (this.state.player_state.items.indexOf(obj_name) < 0) {
                        response_info = [
                            '拿起了 ' + obj_name
                        ];
                        // update player items
                        this.state.player_state.items = this.state.player_state.items.concat(obj_name);
                    }
                    else {
                        response_info = [ '已经拥有' ];
                    }
                }
            }
            else if (cmd_name === '移到') {
                if (obj_name === this.state.player_state.pos_id) {
                    response_info = [ '已在此地' ];
                }
                else if (this.state.game_state.cur_map[this.state.player_state.pos_id].next.indexOf(obj_name) < 0) {
                    response_info = [ '未知的地点或无法到达的地点' ];
                }
                else {
                    var can_use = true;
                    var closest_bad_item = '';
                    // check pre-req done
                    for (var pre_item in PLACES[obj_name].pre_req ) {
                        if (!this.state.game_state.item_states[pre_item]) {
                            closest_bad_item = pre_item;
                            can_use = false;
                            break;
                        }
                    }
                    if (!can_use) {
                        response_info = [ 
                            '无法移到 ' + obj_name,
                            PLACES[obj_name].pre_req[closest_bad_item].hint_text
                        ];
                    }
                    else {
                        response_info = [
                            '移动到 ' + obj_name,
                            PLACES[obj_name].check_info
                        ];
                        // update place
                        this.state.player_state.pos_id = obj_name;
                    }
                }
            }
        }
        this.logEntryByTexts(response_info);
    }

    respondInteractive(command) {
        var cur_node = this.state.game_state.cur_iteractive_node;
        if (cur_node.next_output_index >= INTERACTIVE_NODES[cur_node.node_id].output.length) {
            // find next node with accepted password
            var next_node_id = Object.keys(INTERACTIVE_NODES[cur_node.node_id].next).find(function(v, k, arr){
                return INTERACTIVE_NODES[cur_node.node_id].next[v].passwords.indexOf(command) >= 0;
            });
            if (next_node_id) {
                this.transferToNode(next_node_id);
            }
            else {
                if (INTERACTIVE_NODES[cur_node.node_id].default_next.length) {
                    this.transferToNode(INTERACTIVE_NODES[cur_node.node_id].default_next[0]);
                }
            }
        }
    }

    respondInput(command) {
        if (this.state.game_state.input_mode == 'normal') {
            this.respondNormal(command);
        }
        else {
            this.respondInteractive(command);
        }
    }

    tick() {
        var delta_time = Date.now() - this.last_tick_time;
        this.last_tick_time = Date.now();

        // step interactive node
        var cur_node = this.state.game_state.cur_iteractive_node;
        cur_node.timer += delta_time;
        var output_texts = [];
        if (cur_node.next_output_index < INTERACTIVE_NODES[cur_node.node_id].output.length) {
            if (cur_node.timer > INTERACTIVE_NODES[cur_node.node_id].output_interval) {
                cur_node.timer = 0;
                output_texts = output_texts.concat(INTERACTIVE_NODES[cur_node.node_id].output[cur_node.next_output_index]);
                cur_node.next_output_index += 1;
            }
        }
        if (cur_node.next_output_index >= INTERACTIVE_NODES[cur_node.node_id].output.length) {
            if (INTERACTIVE_NODES[cur_node.node_id].timeout_interval > 0 &&
                INTERACTIVE_NODES[cur_node.node_id].default_next.length &&
                cur_node.timer > INTERACTIVE_NODES[cur_node.node_id].timeout_interval) {
                // to next default node
                this.transferToNode(INTERACTIVE_NODES[cur_node.node_id].default_next[0]);
            }
        }
        if (this.state.game_state.input_mode === 'interactive') {
            // output to log
            this.logEntryByTexts(output_texts);
        }
    }
    
    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 50);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    componentDidUpdate(prevProps) {
        // TODO: try not to directly touch native DOM element
        var app_main = document.getElementById('app-main');
        if (app_main !== null) {
            app_main.scrollTop = app_main.scrollHeight;
        }
    }

    render() {
        return (
            <div id='app-main'>
                <LogWindow entries={this.state.log_entries} />
                <form onSubmit={this.handleSubmit} className='form-console'>
                    <div className='pre-input'>></div>
                    <input id="input-console" onChange={this.handleChange} value={this.state.input_text} autoComplete='off' />
                </form>
            </div>
        );
    }
}

class LogWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className='window-log'>
                { 
                    this.props.entries.map(entry => (
                        <div className='entry-log' key={entry.id}>{ (entry.with_marker ? '>' : '') + entry.text }</div>
                        )
                    )
                }
            </div>
        );
    }
}

class ConsoleInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input_val: ''
        };
    }

    render() {
        return (
            <div>
                { this.state.input_val }
            </div>
        );
    }
}

// entry point
ReactDOM.render(
    <GameApp />,
    document.getElementById('app-wrapper')
);

game_app.logEntryByTexts([ '请尝试可用的动作, 如：查看, 去' ]);
game_app.logEntryByTexts([PLACES['门口'].check_info]);

// load sounds
var audio_ambient = new Audio('media/forest.mp3');
audio_ambient.loop = true;
var audio_e1 = new Audio('media/TheSwan.mp3');
var audio_e2 = new Audio('media/JeTeVeux.mp3');
var audio_e3 = new Audio('media/Largo.mp3');
var audio_loaded = false;
document.getElementById('app-wrapper').addEventListener('click', function(){
    if (!audio_loaded) {
        audio_e1.play();
        audio_e1.pause();
        audio_e2.play();
        audio_e2.pause();
        audio_e3.play();
        audio_e3.pause();
        audio_ambient.play();
    }
    audio_loaded = true;
});
/*
function playAmbientSound() {
    ambient_audio.currentTime = 0;
    ambient_audio.play();
    setInterval(playAmbientSound, 60*2*1000);
}
playAmbientSound();
*/