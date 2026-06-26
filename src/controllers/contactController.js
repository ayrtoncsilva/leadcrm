import { Contact } from '../models/Contact.js';

export async function list(req, res) {
  try {
    const { origem, de, ate } = req.query;
    const contacts = await Contact.findAll({ origem, de, ate });
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar contatos.' });
  }
}

export async function create(req, res) {
  try {
    const { data, nome, origem, qualificado, ativado, respondeu, vendido, agendado, remarcado, faltou, datas_agendamento } = req.body;
    if (!nome?.trim() || !data) {
      return res.status(400).json({ error: 'Nome e data são obrigatórios.' });
    }
    const id = await Contact.create({ data, nome: nome.trim(), origem, qualificado, ativado, respondeu, vendido, agendado, remarcado, faltou, datas_agendamento });
    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar contato.' });
  }
}

export async function remove(req, res) {
  try {
    const affected = await Contact.delete(req.params.id);
    if (!affected) return res.status(404).json({ error: 'Contato não encontrado.' });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover contato.' });
  }
}
