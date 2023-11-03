import JSZip from 'jszip';
import fetchTimeout from 'fetch-timeout';
import { saveAs } from 'file-saver';
import spiderman from '@/spiderman';
import useUserStore from '@/stores/user';
import useDevices from '@/stores/devices';
import useVideo from '@/modules/investigation/composable/video';

function formatDataTime(timestamp) {
  if (timestamp == '')
      return '';
  else
      return spiderman.dayjs(timestamp).format('YYYY/MM/DD HH:mm:ss')
}

function DataTime(timestamp) {
  if (timestamp == '')
      return '';
  else
      return spiderman.dayjs(timestamp).format('YYYY/MM/DD');
}

function getCameraName(cameraId) {
  const devicesStore = useDevices();
  const { findDevice } = devicesStore;
  const camera = findDevice(cameraId);
  return camera ? camera.name : '';
}

async function fetchVideoResource(item) {
  try {
      const response = await fetchTimeout(`${item.videoUrl}`, {
          method: 'GET',
          mode: 'cors',
          credentials: 'omit',
      })

      return await response.blob();
        } catch { err => console.log(err) }
}

export default async function downloadReport(form, taskName, faceDataList, timestamp, faceImage, startTime, endTime) {
  let liveMap = new Map();
  let liveCameras = '';
  let archMap = new Map();
  let archCameras = '';
  let timeList = '';
  // console.log(form);
  // console.log(taskName);
  // console.log(faceDataList);
  // console.log(timestamp);
  // console.log(faceImage);
  // console.log(startTime);
  // console.log(endTime);
  // return;

  const userStore = useUserStore();
  const { user } = userStore;

  const { getVideoUrl } = useVideo();

  const { username } = user;
  const reportTitle = 'Investigation Report';
  const investigationTime = formatDataTime(timestamp);
  const investigationFace = faceImage;
  const reportsubject = 'Subject';

  // page2
  let videoGroup = '';
  let checkedItems = [];

  // for (let I = 0; I < this.facesData.length; I++) {
  for (let I = 0; I < faceDataList.length; I++) {
      const faceData = faceDataList[I];

      if (faceData.checked || true) {
          checkedItems.push(faceData);

          let videoFilename = formatDataTime(faceData.highest.timestamp) + getCameraName(faceData.highest.cid) + '.webm';
          let videoFilenameFormat = videoFilename.replace(/\s/g, '').replace(/:/g, '_');
          let accompany = '';
          let accNumber = 0;
          // faceData.accompanies.forEach(async (acc) => {
          //     if (accNumber > 6) {
          //         return
          //     } else {
          //         if (acc.show) {
          //             accNumber++;
          //             let accImage = `<div class="mugshot-small"><img src="data:image/jpeg;base64,${acc.face_image}" alt=""/></div>`
          //             accompany += accImage;
          //         }
          //     }
          // });

          let mediaClip = `<div class="summary">
                              <div class="record-title">
                                  <span>${formatDataTime(faceData.highest.timestamp)} &nbsp - &nbsp ${getCameraName(faceData.highest.cid)}</span>
                              </div>
                              <div class="facegroup">
                                  <div class="mugshot-big">
                                      <img src="data:image/jpeg;base64,${faceData.highest.face_image}" alt=""/>
                                  </div>
                                  <div class="facesmall">
                                      ${accompany}
                                  </div>
                              </div>
                              <div class="video">
                                  <video controls><source src="./videos/${videoFilenameFormat}"></video>
                              </div>
                          </div>`;
          videoGroup += mediaClip;

          if (faceData.resultFrom === 'LIVE') {
              if (!liveMap.has(faceData.highest.cid)) {
                  liveMap.set(faceData.highest.cid);

                  liveCameras += `<li>${getCameraName(faceData.highest.cid)}</li>`;
              }
          }
          else if (faceData.resultFrom === 'PLAYBACK') {
              if (!archMap.has(faceData.highest.cid)) {
                  archMap.set(faceData.highest.cid);

                  archCameras += `<li>${getCameraName(faceData.highest.cid)}</li>`;
              }
          }

          let tlist = `
              <div class="tlist">
                  <div class="circle"></div>
                  <span>${formatDataTime(faceData.highest.timestamp)} &nbsp ${getCameraName(faceData.highest.cid)}</span>
              </div>`;

          timeList += tlist;

      }
  }

  let style = `<style>
              html {background-color: gray;}
              html, body {margin: 0;padding: 0;}
              #app {position: relative;max-width: 595px;margin-left: auto;margin-right: auto;background-color: #ffffff;box-shadow: 0px 2px 2px 2px rgba(0, 0, 0, 0.4);}
              #app .navbar {position: relative;height: 34px;margin: 0;padding: 0;background-color: #2475a0;}
              #app .navbar .img1 {position: absolute;height: 12px;width: 33px;left: 50px;top: 11.5px;background-image: url('./src/assets/image/logo.png');background-position: center;}
              #app .navbar .logo {position: absolute;width: 66px;height: 20px;object-fit: contain;color: #fff;left: 24px;top: 8px;font-size: 17px;font-family: Helvetica;}
              #app .navbar .report-title {position: absolute;top: 8px;left: 95px;height: 20px;margin: 0 0 0 8px;font-family: Helvetica;color: #ffffff;font-size: 17px;font-stretch: normal;line-height: normal;font-weight: 300;font-style: normal;line-height: normal;letter-spacing: normal;}
              #app .title {position: relative;display: block;height: 51px;margin: 0;padding: 0;border-bottom: 1px solid #8a9192;}
              #app .title .title-left {display: inline-block;height: 29px;position: absolute;left: 24px;top: 12px;}
              #app .title .title-left span {font-size: 24px;font-weight: normal;font-family: Helvetica;color: #111111;font-stretch: normal;font-style: normal;line-height: normal;letter-spacing: normal;}
              #app .title .title-right {display: inline-block;position: absolute;left: 510px;top: 12px;}
              #app .title .title-right .name {margin: 0;margin-bottom: 1px;height: 14px;font-family: Helvetica;font-size: 12px;font-weight: normal;font-stretch: normal;font-style: normal;line-height: normal;letter-spacing: normal;text-align: right;color: #999999;}
              #app .title .title-right .date {margin: 0;height: 14px;font-family: Helvetica;font-size: 12px;font-weight: normal;font-stretch: normal;font-style: normal;line-height: normal;letter-spacing: normal;text-align: right;color: #999999;}
              #app .circle {display: inline-block;width: 10px;height: 10px;background-color: #2475a0;border-radius: 100%;margin-right: 10px;vertical-align: center;z-index: 13333333;}
              #app .summary {display: block;position: relative;min-height: 298px;}
              #app .summary .face {position: absolute;height: 88px;width: 88px;top: 16px;left: 24px;background-size: cover;}
              #app .summary .right {display: inline-block;margin-top: 16px;margin-left: 124px;width: 471px;box-sizing: border-box;}
              #app .summary .right .subject {height: 19px;font-family: Helvetica;font-size: 16px;font-weight: Bold;font-stretch: normal;font-style: normal;line-height: normal;letter-spacing: normal;color: #333;}
              #app .summary .right .detail {display: block;margin-top: 12px;}
              #app .summary .right .detail span {font-size: 12px;font-family: Helvetica;color: #333333;font-weight: Bold;}
              #app .summary .right .detail h4 {display: inline-block;margin: 0;padding: 0;font-size: 12px;font-family: Helvetica;color: #333333;}
              #app .summary .right .live-cam {margin-top: 10px;}
              #app .summary .right .live-cam span {font-family: Helvetica-Light;font-size: 14px;vertical-align: top;}
              #app .summary .right .live-cam .list {margin: 0;padding-left: 21px;left: 0;list-style-type: "- ";list-style-position: inside;}
              #app .summary .right .live-cam .list li {font-family: Helvetica;font-size: 12px;margin-top: 4px;}
              #app .live-cam:nth-child(2n-1) .circle {width: 8px;height: 8px;background-color: #ffffff;border: 1px solid #2475a0;}
              #app .ribbon {display: inline-block;position: relative;width: 264px;height: 34px;background-color: #2475a0;}
              #app .ribbon span {position: absolute;margin-left: 24px;margin-top: 7px;font-family: Helvetica;font-weight: Bold;font-size: 16px;color: #ffffff;}
              #app .ribbon .slash1 {display: inline-block;position: absolute;transform: skew(-15deg);height: 34px;width: 7px;background-color: #fff;box-sizing: border-box;left: 242px;}
              #app .ribbon .slash2 {display: inline-block;position: absolute;transform: skew(-15deg);height: 35px;width: 12px;background-color: #fff;box-sizing: border-box;left: 258px;}
              #app .remark {display: block;min-height: 68px;margin-top: 16px;}
              #app .remark p {width: 454px;word-wrap: break-word;margin-left: 24px;font-size: 12px;line-height: 18px;font-family: Helvetica;}
              #app .incident-sum {display: block;position: relative;min-height: 360px;}
              #app .timeline {display: block;margin-top: 10px;box-sizing: border-box;}
              #app .timeline .line {position: absolute;top: 40px;left: 26px;width: 2px;height: 10px;background-color: #d8d8d8;z-index: 0;}
              #app .arrow {display: inline-block;width: 0;height: 0;border-left: 5px solid transparent;border-right: 5px solid transparent;border-top: 10px solid #d8d8d8;margin-left: 22px;vertical-align: top;}
              #app .tlist:nth-child(2n) .circle {width: 8px;height: 8px;background-color: #ffffff;border: 1px solid #2475a0;}
              #app .tlist:last-child {padding-bottom: 0px;}
              #app .tlist {position: relative;display: block;margin-left: 26px;border-left: 2px solid #d8d8d8;padding-bottom: 8px;}
              #app .tlist .circle {margin-left: -6px;}
              #app .tlist span {font-size: 12px;line-height: 18px;letter-spacing: 0;font-family: Helvetica;}
              #app .footer {position: absolute;bottom: 10px;right: 10px;}
              #app .footer .pagetiangle {position: absolute;border-color: transparent #f1f1f1 #f1f1f1 transparent;border-style: solid solid solid solid;border-width: 32px 32px;height: 0px;width: 0px;bottom: -10px;right: -10px;z-index: 1;}
              #app .footer .nowpage {position: relative;font-size: 36px;letter-spacing: 0px;font-family: Helvetica;color: #b8b8b8;z-index: 2;}
              #app .footer .totalpage { position: relative; font-size: 14px; letter-spacing: 0px; font-family: Helvetica; color: #b8b8b8; z-index: 2; }

              #app2 {position: relative;min-height: 842px;max-width: 595px;width: 595px;margin-top: 40px;margin-left: auto;margin-right: auto;background-color: #ffffff;box-shadow: 0px 2px 2px 2px rgba(0, 0, 0, 0.4);page-break-after: always;}
              #app2 .navbar {position: relative;height: 34px;margin: 0;padding: 0;background-color: #2475a0;}
              #app2 .navbar img {position: absolute;height: 12px;width: 33px;left: 50px;top: 11.5px;}
              #app2 .navbar .logo {position: absolute;width: 66px;height: 20px;object-fit: contain;color: #fff;left: 24px;top: 8px;font-size: 17px;font-family: Helvetica;}
              #app2 .navbar .report-title {position: absolute;top: 8px;left: 95px;height: 20px;margin: 0 0 0 8px;font-family: Helvetica;color: #ffffff;font-size: 17px;font-stretch: normal;line-height: normal;font-weight: 300;font-style: normal;letter-spacing: normal;}
              #app2 .title {position: relative;display: block;height: 51px;margin: 0;padding: 0;border-bottom: 1px solid #8a9192;}
              #app2 .title .title-left {display: inline-block;width: 275px;height: 29px;position: absolute;left: 24px;top: 12px;}
              #app2 .title .title-left span {font-size: 24px;font-weight: normal;font-family: Helvetica;color: #111111;font-stretch: normal;font-style: normal;line-height: normal;letter-spacing: normal;}
              #app2 .title .title-right {display: inline-block;position: absolute;left: 510px;top: 12px;}
              #app2 .title .title-right .name {margin: 0;margin-bottom: 1px;height: 14px;font-family: Helvetica;font-size: 12px;font-weight: normal;font-stretch: normal;font-style: normal;line-height: normal;letter-spacing: normal;text-align: right;color: #999999;}
              #app2 .title .title-right .date {margin: 0;height: 14px;font-family: Helvetica;font-size: 12px;font-weight: normal;font-stretch: normal;font-style: normal;line-height: normal;letter-spacing: normal;text-align: right;color: #999999;}
              #app2 .incident-info {display: block;width: 595px;}
              #app2 .ribbon {display: block;position: relative;width: 264px;height: 34px;margin-top: 16px;background-color: #2475a0;}
              #app2 .ribbon span {position: absolute;margin-left: 24px;margin-top: 7px;font-family: Helvetica;font-weight: Bold;font-size: 16px;color: #ffffff;}
              #app2 .ribbon .slash1 {display: inline-block;position: absolute;transform: skew(-15deg);height: 34px;width: 7px;background-color: #fff;box-sizing: border-box;left: 242px;}
              #app2 .ribbon .slash2 {display: inline-block;position: absolute;transform: skew(-15deg);height: 35px;width: 12px;background-color: #fff;box-sizing: border-box;left: 258px;}
              #app2 .summary:last-child:not(:nth-child(2)) {padding-bottom: 100px;}
              #app2 .summary {display: block;position: relative;min-height: 298px;margin-top: 16px;}
              #app2 .summary .record-title {position: relative;width: 547px;height: 28px;background-color: #f1f1f1;margin-top: 16px;margin-left: 24px;}
              #app2 .summary .record-title span {position: absolute;font-size: 12px;letter-spacing: -0.26px;font-family: Helvetica;font-weight: Bold;color: #333333;margin-top: 8px;margin-left: 8px;}
              #app2 .summary .facegroup {display: flex;width: 128px;margin-top: 16px;margin-left: 24px;flex-wrap: wrap;box-sizing: border-box;}
              #app2 .summary .facegroup .mugshot-big {height: 128px;width: 128px;box-sizing: border-box;}
              #app2 .summary .facegroup .mugshot-big img {width: 128px;height: 128px;}
              #app2 .summary .facegroup .facesmall {display: flex;flex-wrap: wrap;box-sizing: border-box;margin-top: 8px;overflow: hidden;}
              #app2 .summary .facegroup .facesmall div:nth-child(3n) {margin-right: 0;}
              #app2 .summary .facegroup .facesmall .mugshot-small {height: 40px;width: 40px;margin-bottom: 4px;margin-right: 4px;box-sizing: border-box;}
              #app2 .summary .facegroup .facesmall .mugshot-small img {height: 40px;width: 40px;}
              #app2 .summary .video {position: absolute;height: 225px;width: 400px;top: 44px;left: 171px;}
              #app2 .summary .video img {width: 100%;height: 100%;}
              #app2 .summary .video video {width: 100%;height: 100%;}
              #app2 .footer {position: absolute;display: block;bottom: 10px;height: 50px;right: 10px;}
              #app2 .footer .pagetiangle {position: absolute;border-color: transparent #f1f1f1 #f1f1f1 transparent;border-style: solid solid solid solid;border-width: 32px 32px;bottom: -10px;right: -10px;z-index: 1;}
              #app2 .footer .page-mng {position: absolute;right: 0;z-index: 2;}
              #app2 .nowpage {font-size: 36px;letter-spacing: 0px;font-family: Helvetica;color: #b8b8b8;}
              #app2 .totalpage { font-size: 14px; letter-spacing: 0px; font-family: Helvetica; color: #b8b8b8; }
          </style>`;

  let header = `
      <div class="navbar"><span class="logo">airaTrack</span><span class="report-title">${reportTitle}</span></div>
      <div class="title">
          <div class="title-left"><span>${reportTitle}</span></div>
          <div class="title-right">
              <h5 class="name">${username}</h5>
              <h5 class="date">${DataTime(investigationTime)}</h5>
          </div>
      </div>`;

  let camList = ``;
  if (liveCameras != '') {
      camList = `
      <div class="live-cam">
          <div class="circle"></div>
          <span>Live Camera</span>
          <ul class="list">${liveCameras}</ul>
      </div>`;
  }

  if (archCameras != '') {
      camList += `
      <div class="live-cam">
          <div class="circle"></div>
          <span>VMS Video Archive</span>
          <ul class="list">${archCameras}</ul>
      </div>`;
  }

  let summary = `
      <div class="summary">
          <div class="face"><img src="data:image/jpeg;base64,${investigationFace}" style="height: 88px; width: 88px;"/></div>
          <div class="right">
              <span class="subject">Subject : ${reportsubject}</span>
              <div class="detail"> <span>Report by :</span><h4>${username}</h4></div>
              <div class="detail"> <span>Create Date :</span><h4>${DataTime(investigationTime)}</h4></div>
              <div class="detail"> <span>Investigation period :</span><h4>${formatDataTime(startTime)} - ${formatDataTime(endTime)}</h4></div>
              <div class="detail"> <span>Investigation Camera :</span></div>
              ${camList}
          </div>
      </div>`;

  let remark = `
      <div class="remark">
          <div class="ribbon">
              <div class="slash1"></div>
              <div class="slash2"></div><span>Remark</span>
          </div>
          <p>${form.remark}</p>
      </div>`;

  let incidentSummary = `                        
      <div class="incident-sum">
          <div class="ribbon"><span>Incident Summary</span>
              <div class="slash1"></div>
              <div class="slash2"></div>
          </div>
          <div class="timeline">
              <div class="line"></div>
              ${timeList}
          </div>
          <div class="arrow"></div>
      </div>` ;

  let footer1 = `
      <div class="footer no-print">
          <span class="nowpage">1</span>
          <span class="totalpage">/2</span>
          <div class="pagetiangle"></div>
      </div>`;

  let footer2 = `
      <div class="footer">
          <div class="page-footer">
              <div class="page-mng"><span class="nowpage">2</span><span class="totalpage">/2</span></div>
              <div class="pagetiangle"></div>
          </div>
      </div>`;

  let incidentInfo = `
      <div class="incident-info">
          <div class="ribbon">
              <span>Incident Information</span>
              <div class="slash1"></div>
              <div class="slash2"></div>
          </div>
      </div>` ;

  const zip = new JSZip();
  const videosFolder = zip.folder('videos');
  const imagesFolder = zip.folder('images');

  async function batchAddFileContent(_item) {
      console.log('LayoutInvestigation', 'doJobWithThrottle', 'takeOne', 'batchAddFileContent');
      let videoFilename = formatDataTime(_item.highest.timestamp) + getCameraName(_item.highest.cid) + '.webm';
      let videoFilenameFormat = videoFilename.replace(/\s/g, '').replace(/:/g, '_');

      // add aira track logo
      // imagesFolder.file('logo.png', airaTrackLogo, { base64: true });

      try {
          // add image
          imagesFolder.file(_item.highest.id + '.png', _item.highest.face_image, { base64: true });
          console.log('LayoutInvestigation', 'doJobWithThrottle', 'takeOne', 'batchAddFileContent', _item.highest.id + '.png');
          // add video
          const url = getVideoUrl({
            starttime: _item.starttime, 
            endtime: _item.endtime,
            highest: { cid: _item.highest.cid },
          });

          _item.videoUrl = url;

          let blob = await fetchVideoResource(_item);
          console.log(videoFilenameFormat, blob.size);
          if (blob.size <= 102400) {
              var txtFile =  videoFilenameFormat.replace('.webm', '.txt') ;
              videosFolder.file(txtFile, 'doenload video file error. please download again');       
          }
          videosFolder.file(videoFilenameFormat, blob, { binary: true });
          console.log('LayoutInvestigation', 'doJobWithThrottle', 'takeOne', 'batchAddFileContent', videoFilename);
      } catch (err) {
          console.log(err);
      }
  }

  let lastitem = 1;
  let doJobWithThrottle = (items, throttle = 1) => {
    console.log('LayoutInvestigation', 'doJobWithThrottle');

    return new Promise(resolve => {
      const takeOne = async () => {
        console.log('LayoutInvestigation', 'doJobWithThrottle', 'takeOne');
        let item = items.shift();

        if (!item) {
            lastitem--;
            if (lastitem <= 0)
                resolve();
            return;
        }
        else {
            await batchAddFileContent(item);
            takeOne();
        }
      }
      for (let i = 0; i < throttle; ++i) takeOne();
    })
  }

  await doJobWithThrottle(checkedItems);

  let fileContent = `
      <html lang="en">
          <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${style}</head>
          <body>` ;

  fileContent += `<div id="app">${header}${summary}${remark}${incidentSummary}${footer1}</div>`;
  fileContent += `<div id="app2">${header}${incidentInfo}${videoGroup}${footer2}</div>`;
  fileContent += `</body></html>`;

  zip.file('index.html', fileContent);

  try {
    zip.generateAsync({ type: 'blob' }).then((blob) => {
      saveAs(blob, `${taskName}.zip`);
          //   this.isDownloadingReport = false;
          //   this.$store.state.isDownloadingReport = this.isDownloadingReport;
    })
  } catch (e) {
          console.log(e);
  }
}