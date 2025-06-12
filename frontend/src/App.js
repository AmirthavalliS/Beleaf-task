import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BASE_URL } from './config';


function App() {
  const [posts, setPosts] = useState([]);
  const [editPost, setEditPost] = useState(null);
  const [show, setShow] = useState(false);
  const [limit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    const { data } = await axios.get(`${BASE_URL}/posts?page=${page}&limit=${limit}`);
    setPosts(data.posts);
    setTotal(data.total);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/posts/${id}`);
      toast.success('Post deleted successfully');
      fetchPosts();
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const handleEdit = (post) => {
    setEditPost(post);
    setShow(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${BASE_URL}/posts/${editPost._id}`, editPost);
      toast.success('Post updated successfully');
      setEditPost(null);
      setShow(false);
      fetchPosts();
    } catch (error) {
      toast.error('Failed to update post');
    }
  };

  const handleClose = () => {
    setShow(false);
    setEditPost(null);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Posts</h1>

      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Body</th>
            <th className='actions-th'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map(post => (
              <tr key={post._id}>
                <td>{post.id}</td>
                <td>{post.title}</td>
                <td>{post.body}</td>
                <td>
                  <Button className='me-2' variant="warning" size="sm" onClick={() => handleEdit(post)}>Edit</Button>{' '}
                  <Button variant="danger" size="sm" onClick={() => handleDelete(post._id)}>Delete</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4">No Data Available</td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="pagination-controls mb-4">
        <Button variant="secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</Button>
        <span>Page {page} of {totalPages}</span>
        <Button variant="secondary" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
      </div>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editPost && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={editPost.title}
                  onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Body</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editPost.body}
                  onChange={(e) => setEditPost({ ...editPost, body: e.target.value })}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdate}>Update</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
