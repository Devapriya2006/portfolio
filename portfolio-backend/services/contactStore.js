const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const mongoose = require('mongoose');
const Contact = require('../models/Contact');

const dataDir = path.join(__dirname, '..', 'data');
const contactsFile = path.join(dataDir, 'contacts.json');

const readLocalContacts = async () => {
  try {
    const rawContacts = await fs.readFile(contactsFile, 'utf8');
    return JSON.parse(rawContacts);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
};

const writeLocalContacts = async (contacts) => {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(contactsFile, `${JSON.stringify(contacts, null, 2)}\n`);
};

const saveContact = async ({ name, email, subject, message, ipAddress }) => {
  const payload = {
    name,
    email,
    subject,
    message,
    ipAddress,
    emailSent: false,
  };

  if (mongoose.connection.readyState === 1) {
    const contact = await Contact.create(payload);
    return { contact, storage: 'mongodb' };
  }

  const now = new Date().toISOString();
  const contact = {
    _id: crypto.randomUUID(),
    ...payload,
    createdAt: now,
    updatedAt: now,
  };

  const contacts = await readLocalContacts();
  contacts.push(contact);
  await writeLocalContacts(contacts);

  return { contact, storage: 'local-file' };
};

const markEmailSent = async (contact, storage) => {
  if (storage === 'mongodb') {
    await Contact.findByIdAndUpdate(contact._id, { emailSent: true });
    return;
  }

  const contacts = await readLocalContacts();
  const updatedContacts = contacts.map((item) =>
    item._id === contact._id ? { ...item, emailSent: true, updatedAt: new Date().toISOString() } : item
  );

  await writeLocalContacts(updatedContacts);
};

module.exports = {
  saveContact,
  markEmailSent,
};
