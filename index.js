/**
 * 手动引入 '@logseq/libs' 会报错，通过 pnpm i 后可以出现相关提示😄
 */
// import '@logseq/libs'

/**
 * @typedef {Object} TinyConfig
 * @property {Boolean} enable
 * @property {Number} threshold
 * @property {String} format
 * @property {Number} quality
 * @property {Number} width
 * @property {String} dir
 */

const PASTE     = "paste"
const NULL      = "null"
const YYYY      = "YYYY"
const YYYYMM    = "YYYYMM"
const YYYYMMDD  = "YYYYMMDD"

let language

//感谢百度翻译😄
const i18n = {
    en: {
        greeting: "Thinks to use plugin {name}, good luck ^.^",
        slash: "🔘toggle image auto tiny",
        turnOn: "Image auto tiny enable!",
        turnOff: "Image auto tiny disabled!",

        title: "Image Auto Tiny Plugin",
        description: "WebP and AVIF are two modern image formats that aim to reduce file size, improve loading speed, and maintain high image quality.",
        enable: "Enable Compression",
        enableDesc: "Automatically compress and convert eligible images after selecting",
        threshold: "Image size threshold",
        thresholdDesc:"Convert only when the image exceeds this value (in bytes), default is 100KB",
        format: "Convert Format",
        formatDesc: "Which smaller format for automatic image conversion (currently logseq does not support displaying avif images)",
        quality: "Picture Quality",
        qualityDesc: "Image compression quality (0-100), default 80, recommended 60-90",
        width: "Small Image Size (width)",
        widthDesc: "Display in small image mode in the data block, with units of px. Values set to no greater than 0 will not take effect",
        dir:"Table of Contents Dateization",
        dirDesc: "The converted image is stored in the assets/storage/image tiny directory, and the date directory format can be configured"

    },
    "zh-CN": {
        greeting: "感谢使用插件 {name} ^.^",
        slash: "🔘启动/关闭图片自动压缩",
        turnOn: "图片自动压缩已启用",
        turnOff: "图片自动压缩已停用",

        title: "图片自动压缩插件",
        description: "WebP 和 AVIF 是两种现代图像格式，目标都是减小文件大小、提升加载速度、同时保持较高画质。",
        enable: "启用压缩",
        enableDesc: "勾选后自动将符合条件的图片进行压缩转换",
        threshold: "图片大小阈值",
        thresholdDesc:"仅当图片超过该值（单位字节）时才进行转换，默认是 100KB",
        format: "转换格式",
        formatDesc: "图片自动转换为何种体积更小的格式（当前 logseq 暂不支持显示 avif 图片）",
        quality: "图片质量",
        qualityDesc: "图片压缩时的质量（0-100），默认 80，推荐 60~90",
        width: "小图尺寸（宽度）",
        widthDesc: "在数据块中以小图模式显示，单位px，设置为不大于0的数值将不生效",
        dir:"目录日期化",
        dirDesc: "转换后的图片存放目录（assets/storages/image-tiny 目录下），可配置日期目录格式"
    }
}

const t = (key, params)=> {
    let text = i18n[language||'en'][key] || key
    params && Object.keys(params).forEach(p=> text = text.replace(`{${p}}`, params[p]))
    return text
}


/**@returns {Array<import('@logseq/libs/dist/LSPlugin.user').SettingSchemaDesc>} */
const buildSettings = ()=> [
    { type: 'heading', title: t('title'), description: t('description')  },
    { key: "enable", type: 'boolean',default: true, title: t('enable'),  description: t('enableDesc') },
    { key: 'threshold', type:'number',default: 102400, title: t('threshold'), description: t('thresholdDesc') },
    { key: "format", type: 'enum', title: t('format'),enumChoices: ["webp", "avif"], enumPicker: 'radio', default: "webp", description: t('formatDesc') },
    { key: "quality", type: 'number', title: t("quality"), default: 80, description: t('qualityDesc') },
    { key: "width", type: 'number',default: 0, title: t('width'), description: t('widthDesc') },
    { key: "dir", type: 'enum', title: t('dir'), default: "null", enumChoices: ["null", YYYY, YYYYMM, YYYYMMDD], enumPicker: 'radio', description: t("dirDesc") }
]

/**
 *
 * @param {Number} n
 */
const intToChar = n => n.toString(36)
/**
 *
 * @param {String} c
 * @returns
 */
const charToInt = c => parseInt(c, 36)

/**
 * 构建日期格式的目录名
 * @param {String} dir
 */
const detectDir = dir=>{
    if(!dir || dir==NULL)
        return ""

    let d = new Date()

    let year = String(d.getFullYear())
    if(dir == YYYY)
        return year+"/"

    let month = String(d.getMonth()+1).padStart(2, '0')
    if(dir == YYYYMM)
        return year+month+"/"

    return year+month+String(d.getDate()).padStart(2, '0')+"/"
}

/**
 *
 * @param {ClipboardEvent} e
 */
const handler = async e=>{
    /**
     * 当 e.clipboardData.types = ['Files'] 时，为粘贴文件
     */
    const files = e.clipboardData.files
    if(files.length==0) return

    /**@type {TinyConfig} */
    const { enable=true, format='webp', quality=80, width=0, threshold=512000, dir="" } = logseq.settings
    if(!enable) return

    let file = files.item(0)

    if(file.size<threshold) return

    //只处理 jpg、png、jpeg 的图片
    if(!/\.(jpg|png|jpeg)$/.test(file.name.toLowerCase()))
        return

    //阻止默认的行为
    e.preventDefault()
    e.stopPropagation()

    const reader = new FileReader()
    reader.onload = async event=>{
        const img = new Image()
        img.onload = async imgE=>{
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            canvas.getContext('2d').drawImage(img, 0, 0)

            // 转换为 Blob 对象的另一种方式
            // const tinyImg = canvas.toDataURL(`image/${format}`, quality/100)
            // const blob = await (await fetch(tinyImg)).blob()

            const blob = await new Promise(resolve=> canvas.toBlob(resolve, `image/${format}`, quality/100))
            //生成4位随机字符
            const hash = Math.random().toString(36).slice(2,6).toUpperCase()
            //文件名中保存了原始大小，方便日后计算压缩效果😄
            const targetFilename = detectDir(dir) + file.name.replace(/\.\w+$/, `_${hash}.${intToChar(file.size)}.${format}`)
            //保存文件，得到的是绝对路径
            const path = await logseq.Assets.makeSandboxStorage().setItem(
                targetFilename,
                await blob.arrayBuffer()
            )

            const ziped = `${((1-blob.size/file.size)*100).toFixed(2)}%`
            console.debug("文件保存到", path, "压缩率", ziped)

            logseq.UI.showMsg(`${file.name}已压缩${ziped}`, 'success')

            const widthOpts = width>0?`{:width ${width}}`:""
            await logseq.Editor.insertAtEditingCursor(`![${file.name}](../assets/storages/${logseq.baseInfo.id}/${targetFilename})${widthOpts}`)
        }
        img.src = event.target.result
    }
    reader.onerror = console.error
    reader.readAsDataURL(file)
}

const toggleHandler = ()=>{
    let { enable=true } = logseq.settings
    enable = !enable

    logseq.updateSettings({ enable })
    logseq.UI.showMsg(enable?t('turnOn'):t('turnOff'))
}

const main = async ()=>{
    // getUserConfigs 需要 ready 后才能返回值
    language = (await logseq.App.getUserConfigs()).preferredLanguage || 'en'

    logseq.useSettingsSchema(buildSettings())

    logseq.Editor.registerSlashCommand(t('slash'), toggleHandler)

    //获取到主输入框
    const rootDiv = parent.document.getElementById("main-content-container")

    rootDiv.addEventListener(PASTE, handler)
    logseq.beforeunload(()=> rootDiv.removeEventListener(PASTE, handler))

    console.debug(t('greeting', {name: logseq.baseInfo.id}))
}

logseq.ready(main).catch(console.error)
