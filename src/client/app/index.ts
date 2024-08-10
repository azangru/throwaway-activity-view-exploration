// import './activity-tracks';
// import './activity-tracks-webgl/index';
// import './activity-tracks-canvas2d/index';


const loadElement = async () => {
  const { pathname } = location;
  if (pathname.endsWith('svg')) {
    await import('./activity-tracks-svg/activity-tracks');
  } else if (pathname.endsWith('canvas-2d')) {
    await import('./activity-tracks-canvas2d/index');
  } else if (pathname.endsWith('webgl')) {
    await import('./activity-tracks-webgl/index');
  }
}

loadElement();
