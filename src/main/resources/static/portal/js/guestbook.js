$(function () {
    guestbook.init();
});

var guestbook = {
    imgUrl: "",
    captchaObj: null,
    init: function () {
        guestbook.bindClick();
    },
    bindClick: function () {
        // 打开留言框
        $("#guestbookBtn").on("click",function () {
            layer.open({
                title: "留言",
                type: 1,
                area: ['680px', '300px'],
                resize: false,
                zIndex: 2,
                content: guestbook.createUI(),
                cancel: function(index, layero){
                    $("#respond").hide();
                    layer.close(index);
                    return true;
                }
            });
        });
    },
    createUI: function () {
        guestbook.imgUrl = "/portal/images/guestbook_" + (Math.floor(Math.random() * 5) + 1) + ".jpg";
        var html = "<div id='respond' class='comment-respond'>"+
            "<form id='guestbookForm' class='clearfix'>"+
            "<div class='clearfix'></div>"+
            "<div class='author-info'>"+
            "<input type='text' name='nickname' id='nickname' placeholder='* 昵  称 : ' value='' tabindex='1' title='Name (required)'/>"+
            "<input type='text' name='email' id='email' placeholder='邮  箱 : ' value='' tabindex='2' title='E-mail(will not be published)'/>"+
            "<input type='text' name='homeUrl' id='url' placeholder='主  页 : ' value='' tabindex='3' title='Website'/>"+
            "</div>"+
            "<div class='clearfix'></div>"+
            "<div class='comment-form-info'>"+
            "<div class='real-time-gravatar'><img id='real-time-gravatar' src='"+guestbook.imgUrl+"' alt='gravatar头像'/></div>"+
            "<p class='input-row'>"+
            "<i class='row-icon'></i>"+
            "<textarea class='text_area' style='resize:none' rows='3' cols='80' name='content' id='content' tabindex='4' placeholder='* 你不说两句吗？(°∀°)ﾉ……'></textarea>"+
            "</p>"+
            "</div>"+
            "<div style='padding-top: 70px;'>"+
            "<span id='c1' style='display: inline-block;padding-left: 65px;'><input type='text' placeholder='* 验证码' id='captcha'> &nbsp;<img src='/admin/captcha.jpg' onclick='guestbook.changeCapche(this)' style='cursor:pointer' /></span>"+
            "<input type='button' class='button' id='submit' tabindex='5' value='发送' onclick='guestbook.submitClick()'/>"+
            "</div>"+
            "</form>"+
            "</div>";
        return html;
    },
    submitClick: function () {
        var nickname = $("#nickname").val();
        if (!nickname) {
            swal("昵称不能为空", "","error");
            return;
        }

        var content = $("#content").val();
        if (!content) {
            swal("留言内容不能为空", "","error");
            return;
        }

        if (content.length > 255) {
            swal("留言内容长度不能超过255", "","error");
            return;
        }

        var captcha = $("#captcha").val();
        if (!captcha) {
            swal("验证码不能为空", "","error");
            return;
        }

        var parameter = {
            "nickname": guestbook.checkSafe(nickname),
            "content": guestbook.checkSafe(content),
            "email": guestbook.checkSafe($("#email").val()),
            "homeUrl": guestbook.checkSafe($("#homeUrl").val()),
            "captcha": captcha,
            "imgUrl": guestbook.imgUrl
        };

        var index = layer.load(1);
        $.post("/guestbook",parameter,function (resp) {
            layer.close(index);
            if (resp.code == 200) {
                window.location.reload(true);
            } else {
                swal("留言失败", resp.msg,"error");
            }
        });
    },
    changeCapche: function (obj) {
        $(obj).attr("src","/admin/captcha.jpg");
    },
    checkSafe: function (str) {
        if(!str) {
            return "";
        }
        return str.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
}