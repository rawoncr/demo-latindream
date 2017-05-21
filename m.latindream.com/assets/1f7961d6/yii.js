yii=(function($){var pub={reloadableScripts:[],clickableSelector:'a, button, input[type="submit"], input[type="button"], input[type="reset"], input[type="image"]',changeableSelector:'select, input, textarea',getCsrfParam:function(){return $('meta[name=csrf-param]').attr('content');},getCsrfToken:function(){return $('meta[name=csrf-token]').attr('content');},setCsrfToken:function(name,value){$('meta[name=csrf-param]').attr('content',name);$('meta[name=csrf-token]').attr('content',value)},refreshCsrfToken:function(){var token=pub.getCsrfToken();if(token){$('form input[name="'+ pub.getCsrfParam()+'"]').val(token);}},confirm:function(message,ok,cancel){if(confirm(message)){!ok||ok();}else{!cancel||cancel();}},handleAction:function($e){var method=$e.data('method'),$form=$e.closest('form'),action=$e.attr('href'),params=$e.data('params');if(method===undefined){if(action&&action!='#'){window.location=action;}else if($e.is(':submit')&&$form.length){$form.trigger('submit');}
return;}
var newForm=!$form.length;if(newForm){if(!action||!action.match(/(^\/|:\/\/)/)){action=window.location.href;}
$form=$('<form method="'+ method+'"></form>');$form.attr('action',action);var target=$e.attr('target');if(target){$form.attr('target',target);}
if(!method.match(/(get|post)/i)){$form.append('<input name="_method" value="'+ method+'" type="hidden">');method='POST';}
if(!method.match(/(get|head|options)/i)){var csrfParam=pub.getCsrfParam();if(csrfParam){$form.append('<input name="'+ csrfParam+'" value="'+ pub.getCsrfToken()+'" type="hidden">');}}
$form.hide().appendTo('body');}
var activeFormData=$form.data('yiiActiveForm');if(activeFormData){activeFormData.submitObject=$e;}
if(params&&$.isPlainObject(params)){$.each(params,function(idx,obj){$form.append('<input name="'+ idx+'" value="'+ obj+'" type="hidden">');});}
var oldMethod=$form.attr('method');$form.attr('method',method);var oldAction=null;if(action&&action!='#'){oldAction=$form.attr('action');$form.attr('action',action);}
$form.trigger('submit');if(oldAction!=null){$form.attr('action',oldAction);}
$form.attr('method',oldMethod);if(params&&$.isPlainObject(params)){$.each(params,function(idx,obj){$('input[name="'+ idx+'"]',$form).remove();});}
if(newForm){$form.remove();}},getQueryParams:function(url){var pos=url.indexOf('?');if(pos<0){return{};}
var qs=url.substring(pos+ 1).split('&');for(var i=0,result={};i<qs.length;i++){qs[i]=qs[i].split('=');result[decodeURIComponent(qs[i][0])]=decodeURIComponent(qs[i][1]);}
return result;},initModule:function(module){if(module.isActive===undefined||module.isActive){if($.isFunction(module.init)){module.init();}
$.each(module,function(){if($.isPlainObject(this)){pub.initModule(this);}});}},init:function(){initCsrfHandler();initRedirectHandler();initScriptFilter();initDataMethods();}};function initRedirectHandler(){$(document).ajaxComplete(function(event,xhr,settings){var url=xhr.getResponseHeader('X-Redirect');if(url){window.location=url;}});}
function initCsrfHandler(){$.ajaxPrefilter(function(options,originalOptions,xhr){if(!options.crossDomain&&pub.getCsrfParam()){xhr.setRequestHeader('X-CSRF-Token',pub.getCsrfToken());}});pub.refreshCsrfToken();}
function initDataMethods(){var handler=function(event){var $this=$(this),method=$this.data('method'),message=$this.data('confirm');if(method===undefined&&message===undefined){return true;}
if(message!==undefined){pub.confirm(message,function(){pub.handleAction($this);});}else{pub.handleAction($this);}
event.stopImmediatePropagation();return false;};$(document).on('click.yii',pub.clickableSelector,handler).on('change.yii',pub.changeableSelector,handler);}
function initScriptFilter(){var hostInfo=location.protocol+'//'+ location.host;var loadedScripts=$('script[src]').map(function(){return this.src.charAt(0)==='/'?hostInfo+ this.src:this.src;}).toArray();$.ajaxPrefilter('script',function(options,originalOptions,xhr){if(options.dataType=='jsonp'){return;}
var url=options.url.charAt(0)==='/'?hostInfo+ options.url:options.url;if($.inArray(url,loadedScripts)===-1){loadedScripts.push(url);}else{var found=$.inArray(url,$.map(pub.reloadableScripts,function(script){return script.charAt(0)==='/'?hostInfo+ script:script;}))!==-1;if(!found){xhr.abort();}}});$(document).ajaxComplete(function(event,xhr,settings){var styleSheets=[];$('link[rel=stylesheet]').each(function(){if($.inArray(this.href,pub.reloadableScripts)!==-1){return;}
if($.inArray(this.href,styleSheets)==-1){styleSheets.push(this.href)}else{$(this).remove();}})});}
return pub;})(jQuery);jQuery(document).ready(function(){yii.initModule(yii);});