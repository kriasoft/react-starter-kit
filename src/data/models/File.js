import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import fileUrl from 'file-url';
import DataType from 'sequelize';
import Model from '../sequelize';

const File = Model.define('file', {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },
  internalName: {
    type: DataType.STRING,
  },
  url: {
    type: DataType.STRING,
  },
});

const FILES_DIR = path.join(__dirname, './files');

File.uploadFile = ({ buffer, internalName, userId }, store = 'fs') => {
  if (store === 'fs') {
    return Model.transaction(t =>
      File.create(
        {
          internalName,
          userId,
        },
        { transaction: t },
      )
        .then(file => {
          const d = new Date();
          const dir = path.join(
            process.env.FILES_DIR || FILES_DIR,
            `${d.getFullYear()}-${
              d.getMonth() + 1 < 10 ? '0' : ''
            }${d.getMonth() + 1}`,
          );
          mkdirp.sync(`${dir}`);
          const filePath = path.join(
            dir,
            `${file.id}${path.parse(internalName).ext}`,
          );
          fs.writeFileSync(filePath, buffer);
          file.url = fileUrl(filePath); // eslint-disable-line no-param-reassign
          return file.save({ transaction: t });
        })
        .catch(() => t.rollback()),
    );
  }
  throw new Error(`store '${store}' is not implemented yet`);
};

export default File;
