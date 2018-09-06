export default function(){
  this.transition(
    this.hasClass('transaction-alert'),
    this.toValue(true),
    this.use('toRight'),
    this.reverse('toRight')
  );

  this.transition(
    this.hasClass('error-message'),
    this.toValue(true),
    this.use('toDown'),
    this.reverse('toUp')
  )
}
