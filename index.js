const fs = require('fs');

let stringToParse = fs.readFileSync('./input.txt', { encoding: 'utf8', flag: 'r' });

const whiteListClassNames = ['form-group', 'form-control', 'round', 'd-flex-column', 'justify-content-center', 'justify-content-start', 'align-items-center', 'primary', 'secondary', 'flex', 'd-flex', 'tertiary', 'cancel', 'disabled', 'font-base', 'font-bold', 'font-micro', 'font-light', 'font-medium', 'font-headline', 'font-headline-bold', 'font-underline', 'font-micro-bold', 'font-source-code', 'font-weight-bold', 'border-top', 'border-bottom', 'border-left', 'border-right', '?', ':', '===', '!==', '>', '<', '<=', '>=', '&', '&&', '||', '|', `''`, 'w-100', 'opacity85', 'modal_layer', 'title', 'ft-14', 'ft-15', 'ft-16', 'ft-24', 'ft14', 'ft15', 'ft16', 'ft24', 'ft18'];

const replacerFunction = (match) => {
  // console.log('match', match);
  const classNamesArray = match.replace('className=', '').replace(/'/g, '').replace(/{`/g, '').replace(/`}/g, '').split(' ');
  console.log('classNamesArray', classNamesArray);
  const classNamesModified = classNamesArray.map((className) => {
    if (!whiteListClassNames.find((elem) => elem === className) && !className.includes('-color') && !className.includes('${styles[') && !className.includes('-bg')) {
      return '${' + `styles[\'${className}\']}`;
    }
    return className;
  });

  let classNameValue = '';
  console.log('class names modified', classNamesModified);
  classNamesModified.forEach((className, index) => {
    if (index === 0) {
      classNameValue += className;
    } else {
      classNameValue += ` ${className}`;
    }
  });

  classNameValue = 'className={`' + classNameValue + '`}';
  // console.log('class name value', classNameValue);
  return classNameValue;
};

const replacerFunction2 = (match) => {
  // console.log('match', match);
  const classNamesArray = match.replace('className={`', '').replace(/{`/g, '').replace(/`}/g, '').split(' ');
  console.log('classNamesArray', classNamesArray);
  const classNamesModified = classNamesArray.map((className, index) => {
    if (!whiteListClassNames.find((elem) => elem === className) && !className.includes('-color') && !className.includes('${styles[') && !className.includes('${') && !className.includes('}') && className.length > 1) {
      if (index > 0 && classNamesArray[index - 1] === '?') {
        return `styles[\'${className.replace(/'/g, '')}\']`;
      }
      return '${' + `styles[\'${className.replace(/'/g, '')}\']}`;
    }
    return className;
  });

  let classNameValue = '';

  classNamesModified.forEach((className, index) => {
    if (index === 0) {
      classNameValue += className;
    } else {
      classNameValue += ` ${className}`;
    }
  });

  classNameValue = 'className={`' + classNameValue + '`}';
  // console.log('class name value', classNameValue);
  return classNameValue;
};

const regexClassname = /className='([\w-_ ]+)'/g;

let stringParsed = stringToParse.replace(regexClassname, replacerFunction);

console.log('string parsed', stringParsed);
const regexClassname2 = /className={`(.)+?`}/g;

let stringParsed2 = stringParsed.replace(regexClassname2, replacerFunction2);

let stringParsed3 = stringParsed2.replace(`import '../styles.scss';`, `import styles from '../styles.module.scss';`);
let stringParsed4 = stringParsed3.replace(`import './styles.scss';`, `import styles from './styles.module.scss';`);

fs.writeFileSync('./input.txt', stringParsed4);

console.log('File written successfully\n');
