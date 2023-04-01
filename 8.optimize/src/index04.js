import moment from "moment";
// 使用IgnorePlugin把所有语言包都忽略，然后手动import相应的语音包
import "moment/locale/zh-cn";
console.log(moment().format("MMMM Do YYYY, h:mm:ss a"));
