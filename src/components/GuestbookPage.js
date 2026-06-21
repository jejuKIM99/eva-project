// src/components/GuestbookPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import md5 from 'crypto-js/md5';
import GuestbookBackground from './GuestbookBackground'; // 3D 배경 컴포넌트 import

const GuestbookPage = ({ onBack, triggerEntrance }) => {
    const [entries, setEntries] = useState([]);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 수정 관련 상태
    const [editingEntry, setEditingEntry] = useState(null); // 수정 중인 글의 정보
    const [editMessage, setEditMessage] = useState(''); // 수정 중인 메시지 내용

    // Custom Modal & Alert state
    const [passwordModal, setPasswordModal] = useState({
        isOpen: false,
        type: 'delete', // 'delete' or 'edit'
        targetId: null,
        targetEntry: null,
        passwordInput: ''
    });
    const [customAlert, setCustomAlert] = useState({
        isOpen: false,
        message: ''
    });

    const fetchEntries = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('guestbook')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching entries:', error);
            setError('Failed to load. Please try again later.');
        } else {
            setEntries(data);
            setError(null);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    const showAlert = (msg) => {
        setCustomAlert({ isOpen: true, message: msg });
    };

    const closeAlert = () => {
        setCustomAlert({ isOpen: false, message: '' });
    };

    const validateName = (name) => {
        const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
        const japaneseRegex = /[ぁ-んァ-ヶ一-龠]/;

        if (koreanRegex.test(name)) {
            if (name.length > 10) {
                showAlert('이름(한글)은 10자 이내로 입력해주세요.');
                return false;
            }
        } else if (japaneseRegex.test(name)) {
            if (name.length > 20) {
                showAlert('名前（日本語）は20文字以内で入力してください。');
                return false;
            }
        } else { // 영문 및 기타
            if (name.length > 20) {
                showAlert('Name must be within 20 characters.');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !password || !message) {
            showAlert('Name, password, and message are required.');
            return;
        }
        if (!validateName(name)) return;

        const hashedPassword = md5(password).toString();
        const { error } = await supabase
            .from('guestbook')
            .insert([{ name, password: hashedPassword, message }]);

        if (error) {
            console.error('Error inserting entry:', error);
            setError('Failed to submit. Please try again later.');
        } else {
            setName('');
            setPassword('');
            setMessage('');
            fetchEntries();
        }
    };

    const handleDeleteClick = (id) => {
        setPasswordModal({
            isOpen: true,
            type: 'delete',
            targetId: id,
            targetEntry: null,
            passwordInput: ''
        });
    };

    const handleEditClick = (entry) => {
        setPasswordModal({
            isOpen: true,
            type: 'edit',
            targetId: null,
            targetEntry: entry,
            passwordInput: ''
        });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        const { type, targetId, targetEntry, passwordInput } = passwordModal;

        if (!passwordInput) {
            showAlert('Password is required.');
            return;
        }

        const id = type === 'delete' ? targetId : targetEntry.id;
        const { data, error: fetchError } = await supabase.from('guestbook').select('password').eq('id', id).single();
        if (fetchError || !data) {
            showAlert('Entry not found.');
            return;
        }

        if (data.password === md5(passwordInput).toString()) {
            setPasswordModal(prev => ({ ...prev, isOpen: false }));
            if (type === 'delete') {
                const { error: deleteError } = await supabase.from('guestbook').delete().eq('id', id);
                if (deleteError) {
                    showAlert('Failed to delete. Please try again later.');
                } else {
                    showAlert('Entry deleted successfully.');
                    fetchEntries();
                }
            } else {
                setEditingEntry(targetEntry);
                setEditMessage(targetEntry.message);
            }
        } else {
            showAlert('Password does not match.');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const { error } = await supabase
            .from('guestbook')
            .update({ message: editMessage })
            .eq('id', editingEntry.id);

        if (error) {
            showAlert('Failed to update. Please try again later.');
        } else {
            showAlert('Updated successfully.');
            setEditingEntry(null);
            setEditMessage('');
            fetchEntries();
        }
    };

    return (
        <div className="guestbook-page-layout">
            <GuestbookBackground />
            <button onClick={onBack} className="back-button">← MENU</button>
            <div className="guestbook-container">
                <h1 className="guestbook-title">GUESTBOOK</h1>
                
                <form className="guestbook-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <input type="text" placeholder="NAME" value={name} onChange={(e) => setName(e.target.value)} />
                        <input type="password" placeholder="PASSWORD" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <textarea placeholder="MESSAGE..." value={message} onChange={(e) => setMessage(e.target.value)} maxLength="500" />
                    <button type="submit" className="submit-button">SUBMIT</button>
                </form>

                <div className="guestbook-list">
                    {loading && <p className="loading-text-gb">LOADING...</p>}
                    {error && <p className="error-text-gb">{error}</p>}
                    {!loading && entries.map(entry => (
                        <div key={entry.id} className="guestbook-entry">
                            {editingEntry?.id === entry.id ? (
                                <form className="guestbook-edit-form" onSubmit={handleUpdate}>
                                    <div className="entry-header">
                                        <span className="entry-name">{entry.name}</span>
                                        <span className="entry-date">{new Date(entry.created_at).toLocaleString()}</span>
                                    </div>
                                    <textarea
                                        value={editMessage}
                                        onChange={(e) => setEditMessage(e.target.value)}
                                        maxLength="500"
                                    />
                                    <div className="edit-buttons">
                                        <button type="submit" className="save-button">SAVE</button>
                                        <button type="button" onClick={() => setEditingEntry(null)} className="cancel-button">CANCEL</button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="entry-header">
                                        <span className="entry-name">{entry.name}</span>
                                        <span className="entry-date">{new Date(entry.created_at).toLocaleString()}</span>
                                    </div>
                                    <p className="entry-message">{entry.message}</p>
                                    <div className="entry-actions">
                                        <button className="action-button edit" onClick={() => handleEditClick(entry)}>EDIT</button>
                                        <button className="action-button delete" onClick={() => handleDeleteClick(entry.id)}>DELETE</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Custom NERV-style Password Modal */}
            {passwordModal.isOpen && (
                <div className="guestbook-modal-overlay">
                    <div className="guestbook-modal warning-border">
                        <div className="guestbook-modal-header warning-bg">
                            <span>CLASSIFIED ACCESS AUTHENTICATION</span>
                        </div>
                        <div className="guestbook-modal-body">
                            <div className="emergency-caution-box">
                                <div className="emergency-stripe"></div>
                                <div className="emergency-text">ALERT: ENTRY MUTATION REQUIRED</div>
                                <div className="emergency-stripe"></div>
                            </div>
                            <p className="prompt-text">
                                {passwordModal.type === 'delete' 
                                    ? 'ENTER PASSWORD TO DECLASSIFY AND PURGE ENTRY FROM DATABASE:' 
                                    : 'ENTER PASSWORD TO AUTHORIZE EDIT PRIVILEGES:'}
                            </p>
                            <form onSubmit={handlePasswordSubmit}>
                                <input 
                                    type="password" 
                                    className="terminal-input"
                                    placeholder="PASSWORD" 
                                    value={passwordModal.passwordInput} 
                                    onChange={(e) => setPasswordModal(prev => ({ ...prev, passwordInput: e.target.value }))} 
                                    autoFocus
                                />
                                <div className="modal-buttons">
                                    <button type="submit" className="modal-btn confirm">CONFIRM</button>
                                    <button type="button" className="modal-btn cancel" onClick={() => setPasswordModal(prev => ({ ...prev, isOpen: false }))}>ABORT</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom NERV-style Alert Modal */}
            {customAlert.isOpen && (
                <div className="guestbook-modal-overlay">
                    <div className="guestbook-modal alert-border">
                        <div className="guestbook-modal-header alert-bg">
                            <span>SYSTEM NOTICE</span>
                        </div>
                        <div className="guestbook-modal-body">
                            <p className="alert-message">{customAlert.message}</p>
                            <div className="modal-buttons">
                                <button className="modal-btn confirm" onClick={closeAlert}>ACKNOWLEDGE</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuestbookPage;