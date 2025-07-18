define(["Player", "jquery", "ui"],
function(Player,  $,         ui){
    "use strict";

    var Human = function(id, name){
        Player.call(this, id, name);
        this.row.flipped = false;
        this.display.setHuman(true);
    };

    Human.prototype = Object.create(Player.prototype);

    Human.prototype.takeIn = function(cards){
        Player.prototype.takeIn.call(this,cards);
        this.row.setSelected(cards);
    };

    Human.prototype.decide = function(validCards){
        validCards.forEach(function(c){
            c.display.setSelectable(true);
        });
        if(validCards.length === 1 && validCards[0].id === 26){
            ui.showMessage('請先出梅花2。');
        }
        var d = $.Deferred();
        var row = this.row;
        var self = this;
        
        var originalClickHandler = function(){
            var selectedCards = row.getSelected();
            if(selectedCards.length === 0){
                // 如果沒有選擇卡片，顯示警告信息並重新綁定
                ui.showMessage('請先選擇一張牌！');
                // 重新綁定同樣的處理函數
                setTimeout(function(){
                    ui.buttonClickOnce(originalClickHandler);
                }, 0);
                return;
            }
            ui.hideMessage();
            ui.hideButton();
            validCards.forEach(function(c){
                c.display.setSelectable(false);
            });
            d.resolve(selectedCards[0]);
        };
        
        ui.buttonClickOnce(originalClickHandler);
        return d;
    };

    Human.prototype.confirmTransfer = function(){
        ui.showButton("確認");
        ui.hideArrow();
        ui.hideMessage();
        var d = $.Deferred();
        ui.buttonClickOnce(function(){
            this.doneTransfer();
            d.resolve();
        }.bind(this));
        return d;
    };

    Human.prototype.doneTransfer = function(){
        this.row.curShifted = [];
        this.row.adjustPos();
        ui.hideButton();
    };

    Human.prototype.initForNewRound = function(){
        Player.prototype.initForNewRound.call(this);
        this.row.curShifted = [];
    };

    Human.prototype.prepareTransfer = function(dir){
        ui.showPassingScreen(dir);
        this.row.cards.forEach(function(c){
            c.display.setSelectable(true);
        });
        this.row.maxShift = 3;
        var d = $.Deferred();
        var row = this.row;
        ui.arrowClickOnce(function(){
            this.selected = row.getSelected();
            this.row.maxShift = 1;
            this.row.cards.forEach(function(c){
                c.display.setSelectable(false);
            });
            d.resolve();
        }.bind(this));

        return d;
    };

    Human.prototype.rowSelected = function(){
        if(this.row.maxShift === 3){
            ui.showArrow();
        } else {
            ui.hideMessage();
            ui.showButton("出牌！");
        }
    };

    Human.prototype.rowDeselected = function(){
        if(this.row.maxShift === 3){
            ui.hideArrow();
        } else {
            ui.hideButton();
        }
    };

    return Human;
});