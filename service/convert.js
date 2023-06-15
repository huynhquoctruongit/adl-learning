const blockTag = ['@khai_niem', '@vi_du', '@ghi_nho', '@dinh_ly', '@mo_rong', '@phuong_phap'];

const textTag = {
  '@bai_tap': 'Bài tập',
  '@goi_y': 'Gợi ý',
  '@luu_y': 'Lưu ý',
  '@nhan_xet': 'Nhận xét',
  '@loi_giai': 'Lời giải'
};

function replaceTextTag(content) {
  for (const tagName in textTag) {
    if (content.includes(tagName)) {
      let htmlTag = '';

      if (tagName === '@bai_tap') {
        htmlTag = `<div class="glx-pratice content-tag-title" data-icon="$ICON_GLX_PRACTICE">Bài tập:</div>`;
      } else if (tagName === '@goi_y') {
        htmlTag = `<div class="glx-hint content-tag-title" data-icon="$ICON_GLX_HINT">Gợi ý:</div>`;
      } else if (tagName === '@luu_y') {
        htmlTag = `<div class="glx-note content-tag-title" data-icon="$ICON_GLX_NOTE">Lưu ý:</div>`;
      } else if (tagName === '@nhan_xet') {
        htmlTag = `<div class="glx-comment content-tag-title">Nhận xét:</div>`;
      } else if (tagName === '@loi_giai') {
        htmlTag = `<div class="glx-answer content-tag-title">Lời giải:</div>`;
      }
      content = content.replaceAll(tagName, htmlTag);
    }
  }

  return content;
}

function splitContentBlock(content = '', start = '@start', end = '@end') {
  const index = [];
  // Get block: Not support block inside block

  let startIndex = content.indexOf(start, 0);
  let endIndex = content.indexOf(end, startIndex + 1);

  if (startIndex !== -1 && endIndex > startIndex) {
    index.push(startIndex, endIndex + end.length);

    while (startIndex !== -1 && endIndex !== -1) {
      startIndex = content.indexOf(start, endIndex + 1);
      if (startIndex !== -1) {
        endIndex = content.indexOf(end, startIndex + 1);
      }

      if (startIndex !== -1 && endIndex > startIndex) {
        index.push(startIndex, endIndex + end.length);
      }
    }
  }

  const blocks = [];
  for (let i = 0; i < index.length; i += 2) {
    const sub = content.substring(index[i], index[i + 1]);
    blocks.push({
      old: sub,
      new: null,
      blank: sub.replace(start, '').replace(end, '').trim()
    });
  }

  return blocks;
}

function rebuildContent(content = '', tag = '') {
  // 1. Find all index of tags
  // 2. Replace step by step tag index [from,to]
  // Get all index of tag in content
  const index = [];
  let lastIndex = content.indexOf(tag, 0);

  if (lastIndex !== -1) index.push(lastIndex);

  while (lastIndex != -1) {
    lastIndex = content.indexOf(tag, lastIndex + 1);
    if (lastIndex !== -1) {
      index.push(lastIndex);
    }
  }

  // Before have index cut substring and rebuild
  const contentList = splitContentBlock(content, tag, tag);

  // Rebuild new content each item.
  for (const item of contentList) {
    // Replace <p> and </p>.
    let newContent = item.old;
    const firstP = newContent.indexOf('</p>');
    const temp = newContent.substring(0, firstP + 4);
    if (!temp.includes('<p>')) {
      newContent = newContent.replace(temp, `${tag}`);
    }
    const lastP = newContent.lastIndexOf('<p>');
    const temp2 = newContent.substring(lastP, newContent.length);
    if (!temp2.includes('</p>')) {
      newContent = newContent.replace(temp2, `${tag}`);
    }

    newContent = newContent.replaceAll(tag, '');

    let html = '';

    if (tag === '@khai_niem') {
      html = `<div class="glx-concept content-tag" data-icon="$ICON_GLX_CONCEPT">
                <div class="title">Khái niệm</div>
                <div>${item.blank}</div>
            </div>`;
    } else if (tag === '@vi_du') {
      html = `<div class="glx-example  content-tag" data-icon="$ICON_GLX_EXAMPLE">
                <div class="title">Ví dụ</div>
                <div>${item.blank}</div>
              </div>`;
    } else if (tag === '@ghi_nho') {
      html = `<div class="glx-memorize  content-tag" data-icon="$ICON_GLX_MEMORIZE">
                <div class="title">Ghi nhớ</div>
                <div>${item.blank}</div>
              </div>`;
    } else if (tag === '@dinh_ly') {
      html = `<div class="glx-theorem  content-tag" data-icon="$ICON_GLX_THEOREM">
                <div class="title">Định lý</div>
                <div>${item.blank}</div>
              </div>`;
    } else if (tag === '@mo_rong') {
      html = `<div class="glx-maybe  content-tag" data-icon="$ICON_GLX_MORE">
                <div class="title">Mở rộng</div>
                <div>${item.blank}</div>
              </div>`;
    } else if (tag === '@phuong_phap') {
      html = `<div class="glx-method content-tag" data-icon="$ICON_GLX_MORE">
                <div class="title">Phương pháp</div>
                <div>${item.blank}</div>
              </div>`;
    }
    item.new = html;
  }

  return contentList;
}

function replaceContent(content) {
  let newContent = content;
  const replaceList = [];

  for (const tag of blockTag) {
    const needUpdate = rebuildContent(content, tag);
    if (needUpdate.length) {
      replaceList.push(...needUpdate);
    }
  }

  for (const raw of replaceList) {
    if (raw.old && raw.new) {
      // if(  )
      newContent = newContent.replaceAll(raw.old, raw.new).replaceAll('&nbsp;', '');
    }
  }

  // Scan wiki tag
  const wikiTags = splitContentBlock(newContent, '((', '))');

  for (const wiki of wikiTags) {
    const content = wiki.blank;
    wiki.new = `<wiki>${content}</wiki>`;

    newContent = newContent.replace(wiki.old, wiki.new);
  }

  newContent = replaceTextTag(newContent);
  newContent = newContent.replaceAll('&nbsp;', ' ');
  newContent = newContent.replaceAll('\n         ', '');
  newContent = newContent.replaceAll('<p></p>', '');
  newContent = newContent.replaceAll('<p>&nbsp;</p>', '');
  return newContent;
}

function deepScan(object, replaceContent) {
  function needToReplace(text) {
    for (const item of [...Object.keys(blockTag), ...Object.keys(textTag)]) {
      if (text.includes(item)) {
        return true;
      }
    }
    return false;
  }

  const keys = Object.keys(object);
  for (const key of keys) {
    if (!object[key]) continue;
    const type = typeof object[key];

    if (type === 'string') {
      if (needToReplace(object[key])) {
        object[key] = replaceContent(object[key]);
      }
    } else if (type === 'object' && !(object[key] instanceof Array)) {
      object[key] = deepScan(object[key], replaceContent);
    } else if (object[key] instanceof Array) {
      object[key] = object[key].map((item) => {
        return deepScan(item, replaceContent);
      });
    }
  }
  return object;
}

const titles = [
  {
    tag: '@tieu_de2',
    class: 'glx-sub-title'
  },
  {
    tag: '@tieu_de_3',
    class: 'glx-sub-title-2'
  }
];

const convertByRegex = (content) => {
  let replace = content;
  let indexs = [];
  replace = replace.replaceAll(
    /(<h1((?!(<h1>|<\/h1>))(.))*>)(((?!(<h1>|<\/h1>))(.))*)(<\/h1>)/g,
    function (a, one, group1, group2, group3, group4, group5) {
      if (!group4) return '';
      const content = group4.replace(/<br>/g, '').replace('<strong>', '').replace('</strong>', '').split('.');
      // ${current_index === 1 ? 'style="margin-top: 0px"' : ''}
      return `<div class="glx-title">
    <div>${content[0]}</div>
    <span>${content[1]}</span>
    </div>`;
    }
  );

  // replace h2
  replace = replace.replaceAll(
    /(<h2((?!(<h2>|<\/h2>))(.))*>)(((?!(<h2>|<\/h2>))(.))*)(<\/h2>)/g,
    function (a, one, group1, group2, group3, group4) {
      if (!group4) return '';
      return `<div class="glx-sub-title">
    <span>${group4}</span>
    </div>`;
    }
  );

  replace = replace.replaceAll(/(@tieu_de1)(.*)(@tieu_de1)/g, function (a, one, two, three, index) {
    if (!two) return '';
    const content = two.replace(/<br>/g, '').replace('<strong>', '').replace('</strong>', '').split('.');
    return `<div class="glx-sub-title">
      <div>${content[0]}</div>
      <span>${content[1]}</span>
    </div>`;
  });

  // replace ghi nhớ
  replace = replace.replaceAll(/(@ghi_nho)(((?!(@ghi_nho)).)*)(@ghi_nho)/g, function (a, one, two, three, index) {
    if (!two) return '';
    return `<div class="glx-memorize  content-tag" data-icon="$ICON_GLX_MEMORIZE">
          <div class="title">Ghi nhớ</div>
          <div>${two}</div>
    </div>`;
  });

  titles.map((item) => {
    indexs = [];
    const reg = new RegExp(`(${item.tag})(.*)(${item.tag})`, 'g');
    replace = replace.replaceAll(reg, function (a, one, two, three, index) {
      return `<div class="${item.class}">
      <span>${two}</span>
      </div>`;
    });
  });
  return replace;
};

export const convertTag = (content) => {
  try {
    let newContent = content.replaceAll('&nbsp;', ' ');
    newContent = content.replaceAll('style="background-color:rgb(255,255,255);color:rgb(0,0,0);"', ' ');
    let replace = replaceContent(newContent);
    replace = convertByRegex(replace);
    return replace;
  } catch (error) {
    console.error(error);
    return '';
  }
};
