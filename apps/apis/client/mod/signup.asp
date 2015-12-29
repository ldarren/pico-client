<style>
.mdl-layout__content {
    align-items: center;
    justify-content: center;
}
.page-content {
    padding: 24px;
    flex: none;
}
</style>
<div class="mdl-card mdl-shadow--6dp">
    <div class="mdl-card__title mdl-color--primary mdl-color-text--white">
        <h2 class="mdl-card__title-text">Apis</h2>
    </div>
    <div class="mdl-card__supporting-text">
    <form action="#">
        <div class="mdl-textfield mdl-js-textfield">
            <input class="mdl-textfield__input" type="text" id="name" required />
            <label class="mdl-textfield__label" for="name">Name</label>
        </div>
        <div class="mdl-textfield mdl-js-textfield">
            <input class="mdl-textfield__input" type="email" id="email" required />
            <label class="mdl-textfield__label" for="email">Email</label>
        </div>
        <div class="mdl-textfield mdl-js-textfield">
            <input class="mdl-textfield__input" type="text" id="username" required />
            <label class="mdl-textfield__label" for="username">Username</label>
        </div>
        <div class="mdl-textfield mdl-js-textfield">
            <input class="mdl-textfield__input" type="password" id="userpass" required />
            <label class="mdl-textfield__label" for="userpass">Password</label>
        </div>
        <div class="mdl-textfield mdl-js-textfield">
            <input class="mdl-textfield__input" type="password" id="confirm" required />
            <label class="mdl-textfield__label" for="confirm">Type Again</label>
        </div>
    </form>
    </div>
    <div class="mdl-card__actions mdl-card--border">
        <button id=signup class="mdl-button mdl-button--colored mdl-js-button">Sign up</button>
        <a id=cancel href='#'>or, cancel</a>
    </div>
</div>
