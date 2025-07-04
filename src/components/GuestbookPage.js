// src/components/GuestbookPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import md5 from 'crypto-js/md5';
import GuestbookBackground from './GuestbookBackground'; // 3D 배경 컴포넌트 import

const GuestbookPage = ({ onBack }) => {
    const [entries, setEntries] = useState([]);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 수정 관련 상태
    const [editingEntry, setEditingEntry] = useState(null); // 수정 중인 글의 정보
    const [editMessage, setEditMessage] = useState(''); // 수정 중인 메시지 내용

    const fetchEntries = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('guestbook')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching entries:', error);
            setError('Faile to load. Please try again later.');
        } else {
            setEntries(data);
            setError(null);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    const validateName = (name) => {
        const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
        const japaneseRegex = /[ぁ-んァ-ヶ一-龠]/;

        if (koreanRegex.test(name)) {
            if (name.length > 10) {
                alert('이름(한글)은 10자 이내로 입력해주세요.');
                return false;
            }
        } else if (japaneseRegex.test(name)) {
            if (name.length > 20) {
                alert('名前（日本語）は20文字以内で入力してください。');
                return false;
            }
        } else { // 영문 및 기타
            if (name.length > 20) {
                alert('Name must be within 20 characters.');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !password || !message) {
            alert('Name, password, and message are required.');
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

    const handleDelete = async (id) => {
        const inputPassword = prompt('Please enter the password to delete this entry.');
        if (inputPassword === null) return;

        const { data, error: fetchError } = await supabase.from('guestbook').select('password').eq('id', id).single();
        if (fetchError || !data) {
            alert('Entry not found.');
            return;
        }

        if (data.password === md5(inputPassword).toString()) {
            const { error: deleteError } = await supabase.from('guestbook').delete().eq('id', id);
            if (deleteError) {
                alert('Failed to delete. Please try again later.');
            } else {
                alert('Entry deleted successfully.');
                fetchEntries();
            }
        } else {
            alert('Password does not match.');
        }
    };

    const handleEdit = async (entry) => {
        const inputPassword = prompt('Please enter the password to edit this entry.');
        if (inputPassword === null) return;

        const { data, error: fetchError } = await supabase.from('guestbook').select('password').eq('id', entry.id).single();
        if (fetchError || !data) {
            alert('Entry not found.');
            return;
        }

        if (data.password === md5(inputPassword).toString()) {
            setEditingEntry(entry);
            setEditMessage(entry.message);
        } else {
            alert('Password does not match.');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const { error } = await supabase
            .from('guestbook')
            .update({ message: editMessage })
            .eq('id', editingEntry.id);

        if (error) {
            alert('Failed to update. Please try again later.');
        } else {
            alert('Updated successfully.');
            setEditingEntry(null);
            setEditMessage('');
            fetchEntries();
        }
    };

    return (
        <div className="guestbook-page-layout">
            <GuestbookBackground /> {/* 3D 배경 추가 */}
            <button onClick={onBack} className="back-button">← MENU</button>
            <div className="guestbook-container">
                <h1 className="guestbook-title">GUESTBOOK</h1>
                
                {/* 글 작성 폼 */}
                <form className="guestbook-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <input type="text" placeholder="NAME" value={name} onChange={(e) => setName(e.target.value)} />
                        <input type="password" placeholder="PASSWORD" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <textarea placeholder="MESSAGE..." value={message} onChange={(e) => setMessage(e.target.value)} maxLength="500" />
                    <button type="submit" className="submit-button">SUBMIT</button>
                </form>

                {/* 글 목록 */}
                <div className="guestbook-list">
                    {loading && <p className="loading-text-gb">LOADING...</p>}
                    {error && <p className="error-text-gb">{error}</p>}
                    {!loading && entries.map(entry => (
                        <div key={entry.id} className="guestbook-entry">
                            {editingEntry?.id === entry.id ? (
                                // 수정 폼
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
                                // 일반 뷰
                                <>
                                    <div className="entry-header">
                                        <span className="entry-name">{entry.name}</span>
                                        <span className="entry-date">{new Date(entry.created_at).toLocaleString()}</span>
                                    </div>
                                    <p className="entry-message">{entry.message}</p>
                                    <div className="entry-actions">
                                        <button className="action-button edit" onClick={() => handleEdit(entry)}>EDIT</button>
                                        <button className="action-button delete" onClick={() => handleDelete(entry.id)}>DELETE</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GuestbookPage;