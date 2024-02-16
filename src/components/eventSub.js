import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import './eventSub.css';
import moment from 'moment';
import { SubscriptionServiceFactory } from "../services/subscription.service";
import { EventServiceFactory } from "../services/event.service";

const Subscription = () => {
  const user = localStorage.getItem('user');
  const userString = user ? JSON.parse(user) : {};
  //const [festival, setFestival] = useState(null);
  let { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState({});
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState('');
  const [event_id, setEvent_Id] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [staffIds, setStaffIds] = useState([]);

  useEffect(() => {
    const fetchFestivalDetails = async () => {
      try {
        const fetchedFestival = await EventServiceFactory.create().getEventById(id);
        if (fetchedFestival) {
          //setFestival(fetchedFestival);
          setEvent(fetchedFestival);
          setName(fetchedFestival.name);
          setDescription(fetchedFestival.description);
          setTime(fetchedFestival.time);
          setCategory(fetchedFestival.categories);
          setEvent_Id(fetchedFestival.id);
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes do evento', error);
      }
    };

    fetchFestivalDetails();
  }, [id]);

  const handleAddStaff = () => {
    if (selectedStaffId && !staffIds.includes(selectedStaffId)) {
      setStaffIds(prevStaffIds => [...prevStaffIds, selectedStaffId]);
    }
  };

  const handleStaffSelectChange = (e) => {
    setSelectedStaffId(e.target.value);
  };

  const parsedCategoryId = parseInt(category, 10);

  const handleSubmit = async () => {
    const subscriptionData = {
      name: name,
      description: description,
      time: time,
      category_id: parsedCategoryId,
      event_id: id,
      staff: staffIds,
    };

    try {
      await SubscriptionServiceFactory.getInstance().createSubscription(subscriptionData);
      alert("Inscrição criada com sucesso!");
      navigate('/');
    } catch (error) {
      console.error("Erro ao criar inscrição:", error);
    }
  };

  return (
    <div className="eventSub">
      <h2>{'Incrição em ' + event.name}</h2>
      <label>Nome: </label>
      <input type="text" value={""} onChange={e => setName(e.target.value)} />
      <label>Descrição: </label>
      <textarea value={""} onChange={e => setDescription(e.target.value)} />
      <label>Horário: </label>
      <input type="datetime-local" id="dateTimeInput" value={moment(time).format("YYYY-MM-DDTHH:mm")} onChange={e => setTime(e.target.value)} />
      <label>Categorias: </label>
      <select className="select_categories" onChange={e => setCategory(e.target.value)}>
        <option value="">Selecione uma categoria</option>
        {event.categories && event.categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.type}</option>
        ))}
      </select>

      <div>
        <label>Staff:</label>
        <select onChange={handleStaffSelectChange}>
          <option value="">Selecione um usuário</option>
          <option value={userString.id}>{userString.username}</option>
        </select>
        <button type="button" onClick={handleAddStaff}>{"Adicionar Staff"}</button>
        <input type="text" value={staffIds.join(", ")} readOnly />
      </div>

      <button type="button" onClick={handleSubmit}>Criar Inscrição</button>
    </div>
  );
};

export default Subscription;
