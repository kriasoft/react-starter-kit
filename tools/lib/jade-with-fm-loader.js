import jade from 'jade';
import fm from 'front-matter';

export default function(source) {
  this.cacheable();

  const fmContent = fm(source);
  const htmlContent = jade.render(fmContent.body);
  var result = Object.assign({content: htmlContent}, fmContent.attributes);
  return result;
}
