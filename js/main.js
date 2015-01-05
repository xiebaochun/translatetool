$(function () {
   ///////////////////////////////////////////////////////////window bar click
                                                             //窗口栏
    var nw = require('nw.gui');

    var win = nw.Window.get();

    win.isMaximized = false;

    win.setMinimumSize(950, 550);

    $("#min").click(function(){
        win.minimize();
    });                                                        
    
    $("#max").click(function(){
        if (win.isMaximized){
            win.unmaximize();
        }else{
            win.maximize();
        }
    });
    
    $("#close").click(function(){
        win.close();
    });

    
    win.on('maximize',function(){
        win.isMaximized = true;
    });

    win.on('unmaximize',function(){
        win.isMaximized = false;
    })

    win.on('loaded', function() {
       
        
    });

    ////////////////////////////////////////////////////////////your code
    var audio;
    var audio_en;
    var audio_am;

    $("#trans_result_js").hide();
    $.get("http://openapi.baidu.com/public/2.0/bmt/translate?client_id=pV3uzGtcbG8LuVqHWGSokivU&q="+"make"+"&from=auto&to=auto",function(data){
                $("#translate_input").removeAttr("readonly");
                setTimeout(function(){
                  $("#loader").fadeOut();  
                },3000);
                
            });
    $.get("http://open.iciba.com/dsapi?file=xml",function(data){
                var result=$.xml2json(xmlToString($(data)));
                //the result of"每日一句"
                console.log("the result of \"每日一句\"");
                console.log(result);
                $("#ds_content").html(result.Document.content);
                $("#ds_note").html(result.Document.note);
                audio=new Audio(result.Document.tts);
            });
    
    $("#translate_input").on("change keyup paste",function(){
      // alert($("#translate_input").val());
       var query=$("#translate_input").val();

       if(query){
           $.get("http://openapi.baidu.com/public/2.0/bmt/translate?client_id=pV3uzGtcbG8LuVqHWGSokivU&q="+query+"&from=auto&to=auto",function(data){
               console.log(data);
               if(data.trans_result!=null){
                 var result=data.trans_result[0]==undefined?"":data.trans_result[0].dst;
                 $("#translate_result").html(result);
                 if(data.from=="zh"){
                   //query=result.toLowerCase();
                 }
               }else{
                 $("#translate_result").html("");
               }

               
          
           
               $.get("http://dict-co.iciba.com/api/dictionary.php?w="+query+"&key=F3D31A7D971EFE7D6195E3D96A6EF254&type=xml",function(data){
                   //console.log(data.trans_result[0].dst);
                   var result=$.xml2json(xmlToString($(data)));//.trans_result[0].dst;
                   console.log(typeof result.dict.acceptation);
                   if(result.dict.acceptation==undefined){
                    $("#trans_result_js").hide();
                    return false;
                  }
                  $("#trans_result_js").show();
                   console.log(result);
                      var dict=result.dict;
                      $("#key_word").html(dict.key);
                      $("#dict_content").empty();
                      //pronousation
                      $("#sound_en").show();
                      $("#sound_am").show();
                      console.log(typeof dict.ps);
                      if(typeof dict.ps=="object"){
                        $("#pro_en").html(" ["+dict.ps[0]+"]");
                        $("#pro_am").html(" ["+dict.ps[1]+"]");  
                        audio_en=new Audio(dict.pron[0]);
                        audio_am=new Audio(dict.pron[1]);
                      }else if(typeof dict.ps=="string"){
                        $("#sound_am").hide();
                        $("#pro_en").html(" ["+dict.ps+"]");
                        audio_en=new Audio(dict.pron);
                      }else if(dict.ps==undefined){
                        //console.log("go to undefined");
                         $("#sound_en").hide();
                         $("#sound_am").hide();
                      }

                      
                      if(typeof dict.acceptation=="object"){      
                        
                        
                        //console.log(typeof dict.acceptation);
                      
                        for(var index in dict.acceptation){
                          console.log(index);
                          $("#dict_content").append("<div><strong>"+dict.pos[index]+"</strong> "+dict.acceptation[index]+"</div>");
                        }
                      }else if(typeof dict.acceptation=="string"){
                          $("#dict_content").append("<strong>"+dict.pos+"</strong> "+dict.acceptation);
                      }
                      
                      //result=result.dict.acceptation.toString();
                      //result=result.replace(/,/g,"<br>");
                   //$("#trans_result_js").html("词典结果:<br><br>"+result);
               });
               $.get("http://dict-co.iciba.com/api/dictionary.php?w="+query+"&key=F3D31A7D971EFE7D6195E3D96A6EF254&type=json",function(data){
                      //console.log(JSON.parse(data));
               });

            });


       }
       else{
          $("#translate_result").html("");
          $("#trans_result_js").hide();
          //$("#trans_result_js").html("");
       } 
    });
    //click the sound icon to play the audio
    $("#icon_sound").click(function(){
      audio.play();
    });
    $("#icon_sound").hover(function(){
      audio.play();
    },function(){});
    /////////////////////
    $("#icon_pro_en").click(function(){ 
      audio_en.play();
    });
    $("#icon_pro_en").hover(function(){
      audio_en.play();
    },function(){});
    /////////////////////
    $("#icon_pro_am").click(function(){
      audio_am.play();
    });
    $("#icon_pro_am").hover(function(){ 
      audio_am.play();
    },function(){});
    

    function xmlToString(xmlData) { // this functions waits jQuery XML 

        var xmlString = undefined;

        if (window.ActiveXObject){
            xmlString = xmlData[0].xml;
        }

        if (xmlString === undefined)
        {
            var oSerializer = new XMLSerializer();
            xmlString = oSerializer.serializeToString(xmlData[0]);
        }

        return xmlString;
    }
    
});