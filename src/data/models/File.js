import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import fileUrl from 'file-url';
import DataType from 'sequelize';
import Model from '../sequelize';
import * as util from './util';

const File = Model.define('file', {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },
  internalName: {
    type: DataType.STRING,
    allowNull: false,
  },
  url: {
    type: DataType.STRING,
  },
  parentType: {
    type: DataType.STRING,
  },
  parentId: {
    type: DataType.UUID,
  },
});

File.prototype.getParentModel = function getParentModel() {
  return Model.models[this.parentType];
};

File.prototype.getParent = function getParent() {
  const model = this.getParentModel();
  return model.findById(this.parentId);
};

File.prototype.canRead = async function canRead(user) {
  if (util.haveAccess(user, this.userId)) return true;
  const obj = await this.getParent();
  return obj.canRead(user);
};

File.prototype.canWrite = function canWrite(user) {
  return util.haveAccess(user, this.userId);
};

const FILES_DIR = path.join(__dirname, './files');

function uploadFileToFS(file, buffer) {
  const d = new Date();
  const dir = path.join(
    process.env.FILES_DIR || FILES_DIR,
    `${d.getFullYear()}-${d.getMonth() + 1 < 10 ? '0' : ''}${d.getMonth() + 1}`,
  );
  mkdirp.sync(`${dir}`);
  const filePath = path.join(
    dir,
    `${file.id}${path.parse(file.internalName).ext}`,
  );
  fs.writeFileSync(filePath, buffer);
  return fileUrl(filePath);
}

const memStore = {};
function uploadFileToMem(file, buffer) {
  memStore[file.id] = buffer;
  return `mem+${file.id}`;
}

export function getFileFromMem(url) {
  if (!url.startsWith('mem+')) return false;
  return memStore[url.substr(4)];
}

const storeToFn = {
  fs: uploadFileToFS,
  mem: uploadFileToMem,
};

File.uploadFile = (
  { buffer, internalName, userId, parentType, parentId },
  store = 'fs',
) =>
  Model.transaction(t =>
    File.create(
      {
        internalName,
        userId,
        parentType,
        parentId,
      },
      { transaction: t },
    )
      .then(async file => {
        if (!storeToFn[store])
          throw new Error(`store '${store}' is not implemented yet`);
        file.url = await storeToFn[store](file, buffer);
        return file.save({ transaction: t });
      })
      .catch(err => {
        console.error(err);
        t.rollback();
      }),
  );

export default File;
