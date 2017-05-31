<section id="contact" class="page_contacts">
    [[!$text_title_chank]]
    <div class="container">
		<div class="row">
			<div class="col-lg-5 col-lg-offset-1 contacts">
				<p>Так же Вы можете задать любые интересующие <br>Вас вопросы по номеру или почте:</p>
				<div class="calll">
					[[getImageList?
					&docid=`[[[[+del]]id]]`
					&tvname=`main-phones`
					&tpl=`@CODE: <span class="perenos">+38[[[[+del]]phone]]</span>`
					]]
				</div>
				<div>
					<span data-us="[[+email]]">email:</span>
					<p>[[[[+del]]email]]</p>
				</div>
				<div>
					<span>skype:</span>
					<p>[[[[+del]]skype]]</p>
				</div>
				<div>
					<span>[[[[+del]]full_address]]</span>
				</div>
				<div>
					<span>понедельник - пятница:</span>
					<p>[[[[+del]]sheduble_week]]</p>
				</div>
				<div>
					<span>суббота - воскресенье: </span>
					<p>[[[[+del]]sheduble_weekend]]</p>
				</div>
			</div>
			<div class="col-lg-5 col-lg-offset-0">
				<div id="map_contacts"></div>
			</div>
		</div>
	</div>
    [[$request_Form]]
</section>
