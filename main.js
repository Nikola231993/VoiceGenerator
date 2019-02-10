var appAngular = angular.module("myTestApplication", []);

function getColor(in_percent){
  var znach = Math.round(((255*3) / 100) * in_percent);

  var red = 0;
  var green = 0;
  var blue = 0;

  if (znach <= 255)
    red = znach;
  else if ((znach - 255) <= 255) {
    red = 255;
    blue = znach - 255;
  }
  else if ((znach - 510) <= 255) {
    blue = 255;
    red = 255 - (znach - 510);
  }
  else {
    red = 100;
    green = 255;
    blue = 0;
  }

  return "rgb(" + red + ", " + green + ", " + blue + ")";
}

function reloadPage(in_isLoad, in_total){
  //Пока не 100% увеличиваем процент
  var onePercent = in_total / 100;
  var nowPer = in_isLoad / onePercent;
  nowPer = nowPer.toFixed(3);

  document.getElementById('m_border2').style.background = getColor(nowPer);

  if(in_isLoad != in_total) {
    document.getElementById('interest').innerHTML = nowPer + ' %';
    document.getElementById('progress').style.width = nowPer + '%';
  }
  else{
    document.getElementById('progress').style.width = 100 + '%';
    document.getElementById('interest').innerHTML = 'Загрузка завершена';
    document.getElementById('interest').style.margin = '15px 0 0 186px';
  }
}

function sleep(ms) {
  ms += new Date().getTime();
  while (new Date() < ms){}
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function translateUkr(in_text) {
  ret = in_text;
  ret = ret.replace(/[ЕеЁёИи]/g, "ї");
  ret = ret.replace(/[Ыы]/g, "и");
  return ret;
}

function translate(in_text) {
  ret = in_text;
  ret = ret.replace(/[Aa]/g, "а");
  ret = ret.replace(/[Bb]/g, "б");
  ret = ret.replace(/[WwVv]/g, "в");
  return ret;
}

function obrab(in_text) {
  ret = in_text;
  ret = ret.replace(/%/g, " процентов ");
  ret = ret.replace(/_/g, " ");
  ret = ret.replace(/-го /g, " ");
  ret = ret.replace(/(\d+)\s*к /g, "$1 тысяч ");
  ret = ret.replace(/(\d+)\s*к\. /g, "$1 тысяч ");
  ret = ret.replace(/[\(\)\:\;\|]+/g, ", ");
  ret = ret.replace(/[\r\n]+/g, ". ");
  ret = ret.replace(/[^А-яЁёA-z0-9 \,\.\!\?\-]+/g, " ");
  ret = ret.replace(/([^А-яЁёA-z0-9]+)([\.,\!\?])/g, "$2");
  ret = ret.replace(/([^А-яЁёA-z0-9\s]+)\-/g, " ");
  ret = ret.replace(/([\.,!\?])/g, "$1 ");
  ret = ret.replaceAll(" +", " ");
  ret = ret.replace(/Анон/g, "+Анон");
  ret = ret.replace(/пришло/g, "пришл+о");
  ret = ret.replace(/быдлотолпой/g, "быдлотолп+ой");
  ret = ret.replace(/дела/g, "дел+а");
  ret = ret.replace(/дрожи/g, "дрож+и");
  ret = ret.replace(/лица/g, "лиц+а");
  ret = ret.replace(/чем/g, "чеем");
  ret = ret.replace(/правят/g, "прав+ят");
  ret = ret.replace(/потеряно/g, "пот+еряно");
  ret = ret.replace(/говне/g, "говнее");
  ret = ret.replace(/говно/g, "говноо");
  ret = ret.replace(/бабах/g, "ба+абах");
  ret = ret.replace(/палят/g, "п+алят");
  ret = ret.replace(/правят/g, "пр+авят");
  ret = ret.replace(/дела/g, "дел+а");
  ret = ret.replace(/пидарок/g, "пидар+ок");
  ret = ret.replace(/ебло/g, "ебл+о");
  ret = ret.replace(/ебало/g, "еб+ало");
  ret = ret.replace(/и т. д./g, "и так далее.");
  return ret;
}

function saveAsDownloadURI(url, filename) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function() {
    var a = document.createElement('a');
    a.href = window.URL.createObjectURL(xhr.response);
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    delete a;
  };
  xhr.open('GET', url);
  xhr.send();
}

function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  link.style = "display: none";
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  setTimeout(function() {
    console.log('link = ' + link);
    document.body.removeChild(link);
    delete link;
  }, 0);
}

function saveFile(url, filename) {
  var a = document.createElement("a");
  a.href = url;
  a.style = "display: none";
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(function() {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
}

var saveByteArray = (function () {
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  return function (data, name) {
      var blob = new Blob(data, {type: "octet/stream"}),
          url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = name;
      a.click();
      window.URL.revokeObjectURL(url);
  };
}());

function changeSpeaker(in_text, in_val, in_txt) {
  var val = in_val;
  var txt = in_txt;

  if (in_text.includes("сальцо и подчеревинка"))
  {
    val = "tatyana_abramova";
    txt = "Абрамова Таня"
  }
  else if (in_text.includes("Верим мы в Путина"))
  {
    val = "voicesearch";
    txt = "Воиссёрч"
  }

  var ret = [val, txt];

  return ret;
}

appAngular.controller('textRedact', function($scope) {
  $scope.textInto = "";
  $scope.textOutput = "";
  $scope.textRegex = "";
  $scope.textForMaxInt = "1";
  $scope.m_isObrab = false;
  $scope.m_buttonStopText = 'Приостановить обработку';
  $scope.m_textName = "";

  $scope.textSpeed = "0.9";
  var speedVal = $scope.textSpeed;
  console.log('speedVal = ' + speedVal);

  var maxInt = 1;
  var numbFile = 1;
  var predZnach = 1;
  var exit = false;
  var m_texts = [];
  var m_numBlock = [];
  var m_isComments = false;
  var m_indexBlock = 0;
  var m_indexLoadFile = 0;

  console.log("textRedact - working!");

  $scope.clearOutputText = function() {
    $scope.textOutput = "";
  }

  $scope.reverseObrabot = function() {

    if ($scope.m_isObrab)
    {
        $scope.m_isObrab = false;
        if (m_texts.length > 0)
          m_stopButton.innerText = "Продолжить обработку";
        else
          m_stopButton.innerText = "(Обработки законченны)";
    }
    else if (m_texts.length > 0)
    {
        $scope.m_isObrab = true;
        m_stopButton.innerText = "Приостановить обработку";
        $scope.goToParse();
    }
    else
    {
      $scope.textOutput = obrab($scope.textInto);
      m_stopButton.innerText = "Обрабатывать нечего";
    }
  }

  $scope.getVoice = function(in_text) {
    var logText = document.getElementById("m_log");
    var outputText = document.getElementById("m_output");
    var infotext1 = document.getElementById("m_infotext1");
    var infotext2 = document.getElementById("m_infotext2");

    var n = document.getElementById("smpl_sel_emotion").options.selectedIndex;
    if (n == 0)
    {
      var lenArr = document.getElementById("smpl_sel_emotion").options.length;
      var n = Math.floor(Math.random()*lenArr);
    }
    var txt1 = document.getElementById("smpl_sel_emotion").options[n].text + ' ';
    var val = document.getElementById("smpl_sel_emotion").options[n].value;

    if (n == 0)
      txt1 = '';

    var n = document.getElementById("smpl_sel_name").options.selectedIndex;
    if (n == 0)
    {
      var lenArr = document.getElementById("smpl_sel_name").options.length;
      var n = Math.floor(Math.random()*lenArr);
    }
    var txt2 = document.getElementById("smpl_sel_name").options[n].text;
    var val2 = document.getElementById("smpl_sel_name").options[n].value;

    var znach = changeSpeaker(in_text, val2, txt2);
    val2 = znach[0];
    txt2 = znach[1];

    var n1 = document.getElementById("smpl_sel_lang").options.selectedIndex;
    var txt3 = document.getElementById("smpl_sel_lang").options[n1].text;
    var val3 = document.getElementById("smpl_sel_lang").options[n1].value;

    if (val3 == "uk-UA" && val2 == "anton_samokhvalov")
    {
      val2 = "nick";
      console.log('Самохвалов не озвучивает на украинском языке!!! Поэтому диктор заменён на Ника!');
    }
    else if (val3 == "uk-UA" && val2 == "tatyana_abramova")
    {
      val2 = "nick";
      console.log('Абрамова не озвучивает на украинском языке!!! Поэтому диктор заменён на Ника!');
    }

    if (val3 == "uk-UA")
    {
        in_text = translateUkr(in_text);
    }

    outputText.value = in_text;
    var speedVal = $scope.textSpeed;

    console.log('speedVal = ' + speedVal);

    var m_video = document.getElementById('m_video');
    var url = 'https://tts.voicetech.yandex.net/generate?' +
      'key=069b6659-984b-4c5f-880e-aaedcfd84102' +
      '&text=' + encodeURI(in_text) +
      '&format=mp3' +
      '&lang=' + val3 +
      '&emotion=' + val +
      '&speed=' + speedVal +
      '&speaker=' + val2;

    m_video.src = url;
    m_video.load();

    m_video.onloadeddata = function() {
      infText = '';

      if (m_isComments)
      {
            if (in_text.includes(" написал комментарий "))
            {
              m_indexBlock += 1;
              numbFile = 1;
            }
            nameFile = '(' + m_indexBlock + '.' + numbFile + ') (' + txt1 + txt2 + ") " + $scope.m_textName + '.mp3';
            infText = '(' + m_indexLoadFile + ') ' + m_indexBlock + '.' + numbFile + ' ' + txt1 + txt2;
      }
      else
      {
            nameFile = '(' + numbFile + ') (' + txt1 + txt2 + ") " + $scope.m_textName + '.mp3';
            infText = numbFile + ' ' + txt1 + txt2;
      }

      saveAsDownloadURI(m_video.src, nameFile);
      numbFile += 1;
      m_texts.shift();
      m_numBlock.shift();

      if ($scope.m_isObrab && m_texts.length > 0)
      {
        m_indexLoadFile += 1;
        reloadPage(m_indexLoadFile, m_texts.length + m_indexLoadFile);
        infotext1.innerText = infText;
        infotext2.innerText = 'Ещё осталось: ' + m_texts.length;
        sleep(500);
        try{
          $scope.goToParse();
        }
        catch (e)
        {
          logText.value += 'Ошибка ' + e.name + ":" + e.message + "\n" + e.stack + "\r\n";
          console.error('Ошибка ' + e.name + ":" + e.message + "\n" + e.stack);
          $scope.goToParse();
        }
      }
      else if (!$scope.m_isObrab && m_texts.length > 0)
      {
          infotext1.innerText = "Обработка приостановлена!!!";
          infotext2.innerText = '';
          console.log('***************  Обработка приостановлена!!!  *****************');
      }
      else
      {
          reloadPage(100, 100);
          infotext1.innerText = "Всё готово!!!";
          infotext2.innerText = "Всего готово: " + m_indexLoadFile;
          console.log('***************  Всё готово!!!  *****************');
      }
    };
  }

$scope.goToParse = function() {
  try{
    $scope.getVoice(m_texts[0]);
  }
  catch (e)
  {
    console.error('Ошибка ' + e.name + ":" + e.message + "\n" + e.stack);
    logText.value += 'Ошибка ' + e.name + ":" + e.message + "\n" + e.stack + "\r\n";
    $scope.goToParse();
  }
}

  $scope.redactText = function() {
    var textStr = "";
    if ($scope.textInto.includes(" написал комментарий "))
      m_isComments = true;
    else
      m_isComments = false;

    textsArr = obrab($scope.textInto).split(" ");
    textRegex = document.getElementById("m_textRegex");
    $scope.m_textName = textRegex.value;

    if(textsArr && m_texts.length == 0)
    {
      var numbBlock = 0;
      for (var i = 0; i < textsArr.length; i++)
      {
        textStr += textsArr[i] + " ";
        if (textStr.length > 500 && (textStr.endsWith(". ") || textStr.endsWith("? ") || textStr.endsWith("! ") || textStr.length > 570))
        {
          console.log('textStr = ' + textStr);
          if (textStr.length < 650)
          {
            m_texts.push(textStr);
            if (m_isComments && textStr.includes(" написал комментарий "))
              numbBlock += 1;
            m_numBlock.push(numbBlock);
          }
          textStr = "";
        }
      }
      if (textStr.length > 0)
      {
        m_texts.push(textStr);
        m_numBlock.push(numbBlock);
      }

      console.log('m_texts = ' + m_texts);
      $scope.m_isObrab = true;
      $scope.goToParse();
    }
    else if (m_texts.length > 0)
      $scope.goToParse();
  }

  $scope.showObrabot = function() {
    var textStr = "";
    textsArr = obrab($scope.textInto).split(" ");
    var texts = [];
    var numBlock = [];
    var textOut = "";
    var numTextStr = 0;
    var isComentsText = false;

    if ($scope.textInto.includes(" написал комментарий "))
    isComentsText = true;

    if(textsArr)
    {
      var numbBlock = 0;
      for (var i = 0; i < textsArr.length; i++)
      {
        textStr += textsArr[i] + " ";
        if (textStr.length > 500 && (textStr.endsWith(". ") || textStr.endsWith("? ") || textStr.endsWith("! ") || textStr.length > 570))
        {
          if (textStr.length < 650)
          {
            texts.push(textStr);

            if (textStr.includes(" написал комментарий "))
            {
              numbBlock += 1;
              numTextStr = 0;
            }

            numTextStr += 1;

            if (isComentsText)
              textOut += numbBlock + '.' + numTextStr + ') ' + textStr + '\r\n\r\n';
            else
              textOut += numTextStr + ') ' + textStr + '\r\n\r\n';
          }
          textStr = "";
        }
      }
      if (textStr.length > 0)
      {
        texts.push(textStr);
        numBlock.push(numbBlock);

        if (isComentsText)
          textOut += numbBlock + '.' + numTextStr + ') ' + textStr + '\r\n\r\n';
        else
          textOut += numTextStr + ') ' + textStr + '\r\n\r\n';
      }
    }
    $scope.textOutput = textOut;
  }
});
