import { FaTrash, FaEye, FaPen } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css'
import UserModal from './view';
import EditUserModal from './edit';

function List() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get('http://localhost:3333/users/');
      setUsers(response.data);
    }
    fetchData();
  }, []);

  const getStatus = (status) => {
    return status ? "ativado" : "desativado";
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Deseja realmente excluir o usuário?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3333/users/${id}`);
        setUsers(users.filter(user => user.id !== id));
        alert('Usuário excluído com sucesso!');
      } catch (error) {
        alert('Não foi possível excluir o usuário');
      }
    }
  }


  const handleSaveUser = async (user) => {
    try {
      await axios.put(`http://localhost:3333/users/${user.id}`, user);
      setUsers(users.map(u => u.id === user.id ? user : u));
      alert('Usuário atualizado com sucesso!');
    } catch (error) {
      console.log(error)
      alert('Não foi possível atualizar o usuário');
    }
    setShowEditModal(false);
  }


  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  }

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  }

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  }

  return (
    <div className='listContent'>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nome}</td>
              <td>{user.email}</td>
              <td>{user.status ? 'Ativo' : 'Inativo'}</td>
              <td>
                <button onClick={() => handleViewUser(user)}><FaEye /> </button>
                <button onClick={() => handleDelete(user.id)}><FaTrash /></button>
                <button onClick={() => handleEditUser(user)}><FaPen /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <UserModal
          isOpen={showModal}
          user={selectedUser}
          onClose={handleCloseModal}
        />
      )}

      {showEditModal && (
        <EditUserModal
          isOpen={showEditModal}
          user={selectedUser}
          onSave={handleSaveUser}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}

export default List;