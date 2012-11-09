/**
* @Class
* @description 标签组件Class
* @author http://jslover.com
* @version 1.0  20120929
*/
(function ($) {
    //构造函数
    var Tag = function (opts) {
        //参数合并
        this.opts = $.extend({}, defaults, opts);
        this.$tag = null;
        this.$tagHistory = null;
        this.$tarText = null;
        this.$tagHistoryText = null;
        this.$tagInput = null;
        //缓存数据
        this.cache = {
            tagList: []
        };
        //初始化
        this.init();
    }
    //默认参数
    var defaults = {
        //标签发布框容器
        tagPostContenter: '#dvi1'
        //标签历史框容器
        , tagHistoryContenter: '#dvi2'
        //标签结果存取框
        , tagPostText: '#txt1'
        //标签历史存取框
        , tagHistoryText: '#txt2'
    };

    //扩展方法
    var fn = {
        //init方法
        init: function () {
            var _this = this;
            //缓存常用容器
            _this.$tag = $(_this.opts.tagPostContenter);
            _this.$tagHistory = $(_this.opts.tagHistoryContenter);
            _this.$tarText = $(_this.opts.tagPostText);
            _this.$tagHistoryText = $(_this.opts.tagHistoryText);
            //初始化当前标签数据
            if (_this.$tarText.length > 0) {
                _this.cache.tagList = $.trim(_this.$tarText.val()).split(',');
            }
            //初始化
            _this.initPost();
            _this.initHistory();

            _this.$tagInput = _this.$tag.find('input:first');

            _this.bindEvent();

        }
        , initPost: function () {
            //初始化发布面板
            var _this = this;
            var h = '';
            h += '<div class="post-tag">';
            h += '    <ul class="clearfix post-tag-list">';
            $(_this.cache.tagList).each(function (i, item) {
                if (item.length > 0) {
                    h += _this.getTagHtml(item);
                }
            });
            h += '    </ul>';
            h += '    <div class="post-tag-input-holder">';
            h += '        <input type="text" class="post-tag-input pb-tag-tip" maxlength="30" />';
            h += '    </div>';
            h += '</div>';
            _this.$tag.html(h);
        }
        , getTagHtml: function (tag) {
            return '<li tag="' + tag + '">' + tag + '<a class="delete-tag-btn" title="删除">x</a></li>';
        }
        , initHistory: function () {
            //初始化历史面板
            var _this = this;
            var h = '';
            if (_this.$tagHistoryText.length > 0) {
                var list = $.trim(_this.$tagHistoryText.val()).split(',');
                h += '<ul class="clearfix recommand-tag-list">';
                $(list).each(function (i, item) {
                    if (item.length > 0) {
                        h += '<li tag="' + item + '">' + item + '</li>';
                    }
                });
                h += '</ul>';
            }
            _this.$tagHistory.html(h);
        }
        , bindEvent: function () {
            var _this = this;
            //绑定删除
            _this.$tag.click(function (e) {
                if (e.target.tagName == 'A') {
                    var $tar = $(e.target);
                    var $tagLi = $tar.parent();
                    _this.removeTag($tagLi.attr('tag'));
                    $tagLi.remove();
                } else if (e.target.tagName == 'UL' || e.target.tagName == 'DIV') {
                    _this.$tagInput.focus();
                }
                return false;
            });
            //绑定从历史记录添加事件
            _this.$tagHistory.click(function (e) {
                if (e.target.tagName == 'LI') {
                    var $tagLi = $(e.target);
                    _this.addTag($tagLi.attr('tag'));
                }
                return false;
            });
            //文本框事件
            _this.$tagInput.blur(function (e) {
                var val = $.trim(this.value);
                _this.addTag(val);
                this.value = '';
            }).keydown(function (e) {
                if (e.keyCode == 13 || e.keyCode == 188) {
                    //回车事件
                    var val = $.trim(this.value.replace(',', ''));
                    _this.addTag(val);
                    this.value = '';
                    return false;
                } else if (e.keyCode == 8) {
                    //回退事件
                    if (this.value == '') {
                        var $li = _this.$tag.find('li:last');
                        if ($li.length > 0) {
                            _this.removeTag($li.attr('tag'));
                            $li.remove();
                        }
                    }
                }
            }).keyup(function (e) {
                var val = this.value;
                if (val.indexOf('，') > 0) {
                    _this.addTag(val.replace('，', ''));
                    this.value = '';
                    return false;
                }
            });

        }
        , addTag: function (tag) {
            //添加一个标签
            var _this = this;
            if (tag.length <= 0) { return; }
            if ($.inArray(tag, _this.cache.tagList) < 0) {
                _this.cache.tagList.push(tag);
                _this.$tarText.val(_this.cache.tagList.join(','));
                _this.$tag.find('ul').append(_this.getTagHtml(tag));
            }
        }
        , removeTag: function (tag) {
            //删除一个标签
            var _this = this;
            var id = $.inArray(tag, _this.cache.tagList);
            if (id >= 0) {
                _this.cache.tagList.splice(id, 1);
                _this.$tarText.val(_this.cache.tagList.join(','));
            }
        }

    };
    //原型赋值
    Tag.prototype = fn;
    //记录到jQuery对象
    $.Tag = Tag;
})(jQuery);