import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const translations = {
  en: {
    title: "BTMS: Blockchain Tender Management",
    subtitle: "Shahjalal University of Science & Technology",
    tabPublish: "Publish Tender",
    tabBid: "Submit Bid",
    tabEvaluate: "Evaluate & Award",
    tabView: "View Tenders", // NEW
    tenderId: "Tender ID",
    tenderTitle: "Tender Title",
    budget: "Budget (BDT)",
    deadline: "Deadline",
    docHash: "Document Hash",
    vendorId: "Vendor ID",
    bidAmount: "Bid Amount (BDT)",
    submitPublish: "Publish to Blockchain",
    submitBid: "Secure Bid on Ledger",
    submitEvaluate: "Trigger Smart Contract Evaluation",
    success: "Transaction Successful!",
    error: "Transaction Failed.",
    tableStatus: "Status", // NEW
    tableWinner: "Winner", // NEW
    refresh: "Refresh Data" // NEW
  },
  bn: {
    title: "BTMS: ব্লকচেইন টেন্ডার ম্যানেজমেন্ট",
    subtitle: "শাহজালাল বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়",
    tabPublish: "টেন্ডার প্রকাশ করুন",
    tabBid: "বিড জমা দিন",
    tabEvaluate: "মূল্যায়ন এবং পুরস্কার",
    tabView: "টেন্ডার তালিকা", // NEW
    tenderId: "টেন্ডার আইডি",
    tenderTitle: "টেন্ডারের শিরোনাম",
    budget: "বাজেট (BDT)",
    deadline: "শেষ তারিখ",
    docHash: "ডকুমেন্ট হ্যাশ",
    vendorId: "ভেন্ডর আইডি",
    bidAmount: "বিডের পরিমাণ (BDT)",
    submitPublish: "ব্লকচেইনে প্রকাশ করুন",
    submitBid: "লেজারে বিড সুরক্ষিত করুন",
    submitEvaluate: "স্মার্ট কন্ট্রাক্ট মূল্যায়ন শুরু করুন",
    success: "লেনদেন সফল হয়েছে!",
    error: "লেনদেন ব্যর্থ হয়েছে।",
    tableStatus: "স্ট্যাটাস", // NEW
    tableWinner: "বিজয়ী", // NEW
    refresh: "ডেটা রিফ্রেশ করুন" // NEW
  }
};

function App() {
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('view'); // Defaulting to the new View tab
  const [status, setStatus] = useState({ message: '', isError: false });
  const [tenders, setTenders] = useState([]); // Array to hold blockchain data

  // Form States
  const [tenderForm, setTenderForm] = useState({ tenderId: '', title: '', budget: '', deadline: '', docHash: '' });
  const [bidForm, setBidForm] = useState({ bidId: '', tenderId: '', vendorId: '', bidAmount: '', docHash: '' });
  const [evalForm, setEvalForm] = useState({ tenderId: '' });

  const t = translations[lang];

  // Fetch Tenders Function
  const fetchTenders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tenders');
      if (res.data.success) {
        setTenders(res.data.tenders);
      }
    } catch (err) {
      console.error("Failed to load tenders", err);
    }
  };

  // Automatically fetch data when the "View Tenders" tab is clicked
  useEffect(() => {
    if (activeTab === 'view') {
      fetchTenders();
    }
  }, [activeTab]);

  const handlePublish = async (e) => {
    e.preventDefault();
    setStatus({ message: 'Processing on ledger...', isError: false });
    try {
      const res = await axios.post('http://localhost:5000/api/tenders', tenderForm);
      setStatus({ message: `${t.success} ${res.data.message}`, isError: false });
    } catch (err) {
      setStatus({ message: `${t.error} ${err.message}`, isError: true });
    }
  };

  const handleBid = async (e) => {
    e.preventDefault();
    setStatus({ message: 'Processing on ledger...', isError: false });
    try {
      const res = await axios.post('http://localhost:5000/api/bids', bidForm);
      setStatus({ message: `${t.success} ${res.data.message}`, isError: false });
    } catch (err) {
      setStatus({ message: `${t.error} ${err.message}`, isError: true });
    }
  };

  const handleEvaluate = async (e) => {
    e.preventDefault();
    setStatus({ message: 'Smart Contract executing...', isError: false });
    try {
      const res = await axios.post(`http://localhost:5000/api/tenders/${evalForm.tenderId}/evaluate`);
      const tenderRes = await axios.get(`http://localhost:5000/api/tenders/${evalForm.tenderId}`);
      const winner = tenderRes.data.tender.winnerId;
      setStatus({ message: `${t.success} ${res.data.message} Winner: ${winner}`, isError: false });
    } catch (err) {
      setStatus({ message: `${t.error} ${err.message}`, isError: true });
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: 'auto' }}>
      
      <button onClick={() => setLang(lang === 'en' ? 'bn' : 'en')} style={{ float: 'right', padding: '8px', cursor: 'pointer' }}>
        {lang === 'en' ? 'বাংলা' : 'English'}
      </button>

      <h2>{t.title}</h2>
      <h4 style={{ color: 'gray', marginTop: '-10px' }}>{t.subtitle}</h4>
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={() => {setActiveTab('view'); setStatus({message:''})}} style={{ padding: '10px', flex: 1, background: activeTab === 'view' ? '#0056b3' : '#ccc', color: activeTab === 'view' ? '#fff' : '#000', cursor: 'pointer', minWidth: '120px' }}>{t.tabView}</button>
        <button onClick={() => {setActiveTab('publish'); setStatus({message:''})}} style={{ padding: '10px', flex: 1, background: activeTab === 'publish' ? '#0056b3' : '#ccc', color: activeTab === 'publish' ? '#fff' : '#000', cursor: 'pointer', minWidth: '120px' }}>{t.tabPublish}</button>
        <button onClick={() => {setActiveTab('bid'); setStatus({message:''})}} style={{ padding: '10px', flex: 1, background: activeTab === 'bid' ? '#0056b3' : '#ccc', color: activeTab === 'bid' ? '#fff' : '#000', cursor: 'pointer', minWidth: '120px' }}>{t.tabBid}</button>
        <button onClick={() => {setActiveTab('evaluate'); setStatus({message:''})}} style={{ padding: '10px', flex: 1, background: activeTab === 'evaluate' ? '#0056b3' : '#ccc', color: activeTab === 'evaluate' ? '#fff' : '#000', cursor: 'pointer', minWidth: '120px' }}>{t.tabEvaluate}</button>
      </div>

      {/* VIEW TENDERS TAB */}
      {activeTab === 'view' && (
        <div>
          <button onClick={fetchTenders} style={{ padding: '8px 15px', marginBottom: '15px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
            ↻ {t.refresh}
          </button>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>{t.tenderId}</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>{t.tenderTitle}</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>{t.tableStatus}</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>{t.tableWinner}</th>
              </tr>
            </thead>
            <tbody>
              {tenders.map((tender, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px' }}>{tender.tenderId}</td>
                  <td style={{ padding: '12px' }}>{tender.title}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      background: tender.status === 'Awarded' ? '#d4edda' : '#fff3cd',
                      color: tender.status === 'Awarded' ? '#155724' : '#856404',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {tender.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#0056b3' }}>
                    {tender.winnerId || '-'}
                  </td>
                </tr>
              ))}
              {tenders.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: 'gray' }}>No active tenders found on the ledger.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* PUBLISH TAB */}
      {activeTab === 'publish' && (
        <form onSubmit={handlePublish} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input placeholder={t.tenderId} onChange={e => setTenderForm({...tenderForm, tenderId: e.target.value})} required style={{ padding: '10px' }} />
          <input placeholder={t.tenderTitle} onChange={e => setTenderForm({...tenderForm, title: e.target.value})} required style={{ padding: '10px' }} />
          <input type="number" placeholder={t.budget} onChange={e => setTenderForm({...tenderForm, budget: e.target.value})} required style={{ padding: '10px' }} />
          <input type="date" onChange={e => setTenderForm({...tenderForm, deadline: e.target.value})} required style={{ padding: '10px' }} />
          <input placeholder={t.docHash} onChange={e => setTenderForm({...tenderForm, docHash: e.target.value})} required style={{ padding: '10px' }} />
          <button type="submit" style={{ padding: '15px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>{t.submitPublish}</button>
        </form>
      )}

      {/* BID TAB */}
      {activeTab === 'bid' && (
        <form onSubmit={handleBid} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input placeholder="Bid ID (e.g. BID-001)" onChange={e => setBidForm({...bidForm, bidId: e.target.value})} required style={{ padding: '10px' }} />
          <input placeholder={t.tenderId} onChange={e => setBidForm({...bidForm, tenderId: e.target.value})} required style={{ padding: '10px' }} />
          <input placeholder={t.vendorId} onChange={e => setBidForm({...bidForm, vendorId: e.target.value})} required style={{ padding: '10px' }} />
          <input type="number" placeholder={t.bidAmount} onChange={e => setBidForm({...bidForm, bidAmount: e.target.value})} required style={{ padding: '10px' }} />
          <input placeholder={t.docHash} onChange={e => setBidForm({...bidForm, docHash: e.target.value})} required style={{ padding: '10px' }} />
          <button type="submit" style={{ padding: '15px', background: '#17a2b8', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>{t.submitBid}</button>
        </form>
      )}

      {/* EVALUATE TAB */}
      {activeTab === 'evaluate' && (
        <form onSubmit={handleEvaluate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input placeholder={t.tenderId} onChange={e => setEvalForm({tenderId: e.target.value})} required style={{ padding: '10px' }} />
          <button type="submit" style={{ padding: '15px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>{t.submitEvaluate}</button>
        </form>
      )}

      {/* STATUS DISPLAY */}
      {status.message && (
        <div style={{ marginTop: '20px', padding: '15px', background: status.isError ? '#f8d7da' : '#d4edda', color: status.isError ? '#721c24' : '#155724', borderRadius: '5px' }}>
          {status.message}
        </div>
      )}
    </div>
  );
}

export default App;