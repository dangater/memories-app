async function loadComments(memoryId) {
    try {
        const comments = await window.electronAPI.fetchComments(memoryId);
        displayComments(comments);
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

function displayComments(comments) {
    // Preserve the current values of the input fields
    const currentCommentName = commentNameInput ? commentNameInput.value : '';
    const currentCommentText = commentTextInput ? commentTextInput.value : '';

    commentsSection.innerHTML = '<h3 style="margin-top: 0px;">Memories</h3>'; // Clear existing comments

    if (comments.length === 0 && !currentFileId) {
        commentsSection.innerHTML += '<p>You\'ll need to add a description and save before comments are available.</p>';
    } else {
        comments.forEach(comment => {
            const commentBox = document.createElement('div');
            commentBox.className = 'comment-box';

            // Parse and format the date
            const commentDate = new Date(comment.comments_date);
            const formattedDate = commentDate.toLocaleString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true // Use 12-hour clock, remove this line for 24-hour clock
            });

            commentBox.innerHTML = `
                <strong>${comment.person}</strong>
                <small>${formattedDate}</small>
                <p id="commentText_${comment.memory_comment_id}" class="comment-text">${comment.comments}</p>
                <div class="comment-actions">
                    <button onclick="editComment(${comment.memory_comment_id})">Edit</button>
                    <button onclick="deleteComment(${comment.memory_comment_id})">Delete</button>
                </div>
            `;
            commentsSection.appendChild(commentBox);
        });

        // Always add input fields for new comments at the end
        const inputFields = `
            <hr style="margin-top: 30px;">
            <small>Share your memories about this file - add your name, memory, and click the add button</small>
            <div class="form-control" style="margin-top: 30px;">
                <label for="commentName">Name</label>
                <input type="text" id="commentName" value="${currentCommentName}">
            </div>
            <div class="form-control">
                <label for="commentText">Memory</label>
                <textarea id="commentText" rows="9">${currentCommentText}</textarea>
            </div>
            <div class="form-actions">
                <button class="button" onclick="addComment()">Add</button>
            </div>
        `;
        commentsSection.innerHTML += inputFields;
    }

    // Reinitialize references to the input fields
    commentNameInput = document.getElementById('commentName');
    commentTextInput = document.getElementById('commentText');
}

async function addComment() {
    const person = commentNameInput.value.trim();
    const comments = commentTextInput.value.trim();

    if (!currentFileId) {
        showToast('FileId is missing');
        return;
    }

    if (!person || !comments) {
        showToast('Please fill out both fields.');
        return;
    }

    try {
        await window.electronAPI.addComment(currentFileId, person, comments);
        showToast('Comment added successfully!');

        commentNameInput.value = '';
        commentTextInput.value = '';

        await loadComments(currentFileId);
    } catch (error) {
        console.error('Error adding comment:', error);
        showToast('Error adding comment.');
    }
}

async function editComment(commentId) {
    const commentTextElement = document.getElementById(`commentText_${commentId}`);
    const originalText = commentTextElement.textContent;

    commentTextElement.innerHTML = `
        <textarea id="editText_${commentId}" style="width: 100%;" rows="3">${originalText}</textarea>
        <button class="edit-comment-button" onclick="saveComment(${commentId})">Save</button>
        <button class="edit-comment-button" onclick="cancelEdit(${commentId}, '${originalText}')">Cancel</button>
    `;
}

function cancelEdit(commentId, originalText) {
    const commentTextElement = document.getElementById(`commentText_${commentId}`);
    commentTextElement.innerHTML = originalText;
}

async function saveComment(commentId) {
    const editTextElement = document.getElementById(`editText_${commentId}`);
    const updatedComment = editTextElement.value.trim();

    if (!updatedComment) {
        showToast('Comment cannot be empty.');
        return;
    }

    try {
        await window.electronAPI.updateComment(commentId, updatedComment);
        showToast('Comment updated successfully!');
        await loadComments(currentFileId);
    } catch (error) {
        console.error('Error updating comment:', error);
        showToast('Error updating comment.');
    }
}

async function deleteComment(commentId) {
    try {
        await window.electronAPI.deleteComment(commentId);
        showToast('Comment deleted successfully!');
        await loadComments(currentFileId);
    } catch (error) {
        console.error('Error deleting comment:', error);
        showToast('Error deleting comment.');
    }
}