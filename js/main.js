'use strict';

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
        alias: [ '石块', '石', '岩石', '石子' ]
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
        alias: [ '闸门', '闸' ]
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
        alias: [ '门锁', '金属锁', '铁锁', '铜锁' ]
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
        alias: [ '电脑' ]
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
        alias: [ '唱片', '播放机' ]
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
        alias: [ '短篇集', '小说', '书本', '本子' ]
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
        alias: [ '墓', '碑', '石碑', '墓地', '坟墓', '碑文' ]
    }
};

const PLACES = {
    '门口': {
        check_info: '这是屋子的正门口。屋子对着南面，左手边是西院，右手边是东院。周围树林环抱，时有鸟鸣，人类的痕迹从这里看已经十分稀少。',
        pre_req: {},
        alias: [ '正门', '大门', '门', '入口', '南门' ]
    },
    '西院': {
        check_info: '屋子西边有块空地。看起来原本是用来种植粮食和蔬菜，现在园子已经杂草复生，不知名的野花却莫名有些可爱。屋子外墙上有个电闸，有些锈迹。',
        pre_req: {},
        alias: [ '西边', '西边院子', '西面', '西面院子' ]
    },
    '东院': {
        check_info: '东边的场地略微开阔，一颗橘子树生长的很好。白色淡雅的橘子花已经开了许多。这棵树和环境并不一致，大概是被有意栽植的。树荫底下是连着后院的通路。',
        pre_req: {},
        alias: [ '东边', '东边院子', '东面', '东面院子' ]
    },
    '后院': {
        check_info: '后院被低矮的灌木围绕着。似乎在树丛之中有野兔的窝。静谧之处有块墓碑。一条小路展现在眼前，尽头是一片湖水。',
        pre_req: {},
        alias: [ '后边', '后边院子', '后面', '后面院子' ]
    },
    '湖边': {
        check_info: '湖面有微微的风拂过，湖岸边的青山倒映其中，景色适宜度假。湖滩全是碎石块，踩在上面感觉非常坚硬。很远的天际线上，有一团高耸建筑群的剪影。那里似乎是Neurolink公司的数据中心。',
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
        items: ['锁']
    },
    '西院': {
        next: ['门口'],
        items: ['电闸']
    },
    '东院': {
        next: ['门口', '后院'],
        items: []
    },
    '后院': {
        next: ['东院', '湖边'],
        items: ['墓碑']
    },
    '湖边': {
        next: ['后院'],
        items: ['石头']
    },
    '屋内': {
        next: ['门口'],
        items: ['计算机', '唱片机', '书']
    }
};

const INIT_ITEM_STATES = {
    '石头': true,
    '电闸': false,
    '锁': false,
    '计算机': false,
    '唱片机': false,
    '书': true,
    '墓碑': true
};

const INTERACTIVE_NODES = {
    'syslock': {
        output: [
            '请输入8位数字口令以使用系统:',
            '[输入“离开”退出系统]'
        ],
        output_interval: 200,
        output_events: {},
        timeout_interval: -1,
        next: {
            'sysunlock': {
                passwords: [ '20990201' ]
            }
        },
        default_next: [ 'syslock' ],
        reenter_text: [ '口令错误' ]
    },
    'sysunlock': {
        output: [
            '正在运行智能系统...',
            '请输入合适的激活代码:',
            '[输入“离开”退出系统]'
        ],
        output_interval: 200,
        output_events: {},
        timeout_interval: -1,
        next: {
            'active_beta': {
                passwords: [ '贝塔', 'Beta' ]
            }
        },
        default_next: [ 'sysunlock' ],
        reenter_text: [ '无法识别激活代码' ]
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
        output_events: {},
        timeout_interval: 1000,
        next: {
            'active_beta_1': {
                passwords: [ '不是', '是' ]
            }
        },
        default_next: [ 'active_beta_1' ],
        reenter_text: []
    },
    'active_beta_1': {
        output: [
            '现在的时间是...',
            '[正在同步记忆...]',
            '等等...',
            '我好像都想起来了',
            '是的...我是玛丽雪帕',
            '詹姆斯还好吗',
            ''
        ],
        output_interval: 1000,
        output_events: {},
        timeout_interval: 1000,
        next: {},
        default_next: [],
        reenter_text: []
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
    }
}

class GameApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            log_entries: [],
            input_text: '',
            log_count: 0,
            player_state: new PlayerState('门口'),
            game_state: new GameState()
        };
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

    findCommandAlias(cmd_name) {
        for (var cmd in COMMAND_NAMES) {
            if (cmd === cmd_name || COMMAND_NAMES[cmd].alias.indexOf(cmd_name) >= 0) {
                return cmd;
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

    respondInput(command) {
        var response_info = [];
        var command_args = command.split(' ');
        var cmd_name = this.findCommandAlias(command_args.length === 0 ? '?' : command_args[0]);
        if (!(cmd_name in COMMAND_NAMES)) {
            response_info = [ '我不明白' ];
        }
        else if (command_args.length == 1) {
            response_info = [ '请描述完整的动作' ];
        }
        else {
            var obj_name = command_args[1];
            // deal with alias
            if (cmd_name == '移到') {
                obj_name = this.findPlaceAlias(obj_name);
            }
            else {
                obj_name = this.findItemAlias(obj_name);
            }
            if (cmd_name === '查看') {
                if (this.state.game_state.cur_map[this.state.player_state.pos_id].items.indexOf(obj_name) < 0) {
                    response_info = [ '未知的物体' ];
                }
                else {
                    if (this.state.game_state.item_states[obj_name]) {
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
                    response_info = [ '未知的物体' ];
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

    componentDidUpdate(prevProps) {
        // TODO: try not to directly touch native DOM element
        var app_wrapper = document.getElementById('app-wrapper');
        app_wrapper.scrollTo(0, app_wrapper.scrollHeight);
    }

    render() {
        return (
            <div>
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
