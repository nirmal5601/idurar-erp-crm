const pug = require('pug');
const fs = require('fs');
const moment = require('moment');
let pdf = require('html-pdf');
const path = require('path');
const { listAllSettings, loadSettings } = require('@/middlewares/settings');
const { getData } = require('@/middlewares/serverData');
const useLanguage = require('@/locale/useLanguage');
const { useMoney, useDate } = require('@/settings');

const pugFiles = ['invoice', 'offer', 'quote', 'payment', 'query'];

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

exports.generatePdf = async (
  modelName,
  info = { filename: 'pdf_file', format: 'A5', targetLocation: '' },
  result,
  callback
) => {
  try {
    const { targetLocation } = info;

    // if PDF already exists, then delete it and create a new PDF
    if (fs.existsSync(targetLocation)) {
      fs.unlinkSync(targetLocation);
    }

    // render pdf html

    if (pugFiles.includes(modelName.toLowerCase())) {
      // Compile Pug template

      const settings = await loadSettings();
      const selectedLang = settings['idurar_app_language'];
      const translate = useLanguage({ selectedLang });

      const {
        currency_symbol,
        currency_position,
        decimal_sep,
        thousand_sep,
        cent_precision,
        zero_format,
      } = settings;

      const { moneyFormatter } = useMoney({
        settings: {
          currency_symbol,
          currency_position,
          decimal_sep,
          thousand_sep,
          cent_precision,
          zero_format,
        },
      });
      const { dateFormat } = useDate({ settings });

      settings.public_server_file = process.env.PUBLIC_SERVER_FILE;

      const filePath = `${__dirname}/pdf/${modelName}.pug`;
      console.log('Rendering Pug template at:', filePath);

      const htmlContent = pug.renderFile(filePath, {
        model: result,
        settings,
        translate,
        dateFormat,
        moneyFormatter,
        moment: moment,
      });

      // Resolve PhantomJS binary path explicitly
      const phantomPath = '/app/node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs';
      console.log('Using PhantomJS binary at:', phantomPath);

      // Set PhantomJS binary path explicitly in options
      const options = {
        phantomPath: phantomPath, // comment this for running the download locally
        format: info.format,
        orientation: 'portrait',
        border: '10mm',
      };

      pdf.create(htmlContent, options).toFile(targetLocation, function (error) {
        if (error) {
          console.error('Error generating PDF:', error);
          throw new Error(error);
        }
        if (callback) callback();
      });
    }
  } catch (error) {
    console.error('Error in generatePdf function:', error);
    throw new Error(error);
  }
};
